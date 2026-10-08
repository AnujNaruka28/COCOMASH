"use client";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";

export default function YTest() {
  const doc = new Y.Doc();
  const text = doc.getText("code");

  text.insert(0, "Hello");

  console.log(text.toString(), yCollab);

  return <div>Yjs + y-codemirror works</div>;
}