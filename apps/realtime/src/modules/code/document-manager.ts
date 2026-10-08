import * as Y from 'yjs';
import { redisClient } from '../../config/redis';

const SNAPSHOT_PREFIX = 'doc:snapshot:';
const UPDATES_PREFIX = 'doc:updates:';
const COMPACT_THRESHOLD = 100;

const getSnapshotKey = (roomId: string) => `${SNAPSHOT_PREFIX}${roomId}`;
const getUpdatesKey = (roomId: string) => `${UPDATES_PREFIX}${roomId}`;

const applyEncoded = (doc: Y.Doc, encoded: string[]) => {
    for (const e of encoded) Y.applyUpdate(doc, Buffer.from(e, 'base64'));
};

const getDocument = async (roomId: string): Promise<Y.Doc> => {
    const doc = new Y.Doc();
    const snapshot = await redisClient.get(getSnapshotKey(roomId));
    if (snapshot) Y.applyUpdate(doc, Buffer.from(snapshot, 'base64'));
    const updates = await redisClient.lRange(getUpdatesKey(roomId), 0, -1);
    applyEncoded(doc, updates);
    return doc;
};

// Returns the real binary Yjs state, not stringified content.
const getDocumentState = async (roomId: string): Promise<Uint8Array | null> => {
    const doc = await getDocument(roomId);
    const state = Y.encodeStateAsUpdate(doc);
    doc.destroy();
    return state.length ? state : null;
};

const saveDocumentState = async (roomId: string, update: Uint8Array): Promise<void> => {
    const encoded = Buffer.from(update).toString('base64');
    const length = await redisClient.rPush(getUpdatesKey(roomId), encoded);
    if (length >= COMPACT_THRESHOLD) void compactDocument(roomId);
};

const compactDocument = async (roomId: string): Promise<void> => {
    const updatesKey = getUpdatesKey(roomId);
    const compactingKey = `${updatesKey}:compacting`;
    try {
        await redisClient.rename(updatesKey, compactingKey);
    } catch {
        return;
    }
    const doc = new Y.Doc();
    const snapshot = await redisClient.get(getSnapshotKey(roomId));
    if (snapshot) Y.applyUpdate(doc, Buffer.from(snapshot, 'base64'));
    const frozen = await redisClient.lRange(compactingKey, 0, -1);
    applyEncoded(doc, frozen);
    const newSnapshot = Buffer.from(Y.encodeStateAsUpdate(doc)).toString('base64');
    doc.destroy();
    const multi = redisClient.multi();
    multi.set(getSnapshotKey(roomId), newSnapshot);
    multi.del(compactingKey);
    await multi.exec();
};

const deleteDocument = async (roomId: string): Promise<void> => {
    await redisClient.del([getSnapshotKey(roomId), getUpdatesKey(roomId)]);
};

export { 
    getDocument, 
    getDocumentState, 
    saveDocumentState, 
    deleteDocument 
};