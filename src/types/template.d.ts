export interface FontLocator {
  readonly fontFamily: string;
  readonly fontStyle: "normal" | "italic";
  readonly fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

export interface FontSource extends FontLocator {
  url: string;
}

export type Node = TextNode | ViewNode;

export interface Template {
  backgroundColor: [number, number, number, number];
  debug: boolean;
  fontSources: FontSource[];
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  paperSize: [number, number];
  rootNode: Node;
}

export interface TextNode extends FontLocator {
  readonly color: [number, number, number, number];
  readonly fontSize: number;
  readonly minPresenceAhead: number;
  readonly text: string;
  readonly textAlign: "center" | "left" | "right";
  readonly type: "text";
}

export interface ViewNode {
  readonly backgroundColor: [number, number, number, number];
  readonly children: Node[];
  readonly marginBottom: number;
  readonly marginLeft: number;
  readonly marginRight: number;
  readonly marginTop: number;
  readonly minPresenceAhead: number;
  readonly paddingBottom: number;
  readonly paddingLeft: number;
  readonly paddingRight: number;
  readonly paddingTop: number;
  readonly type: "view";
}
