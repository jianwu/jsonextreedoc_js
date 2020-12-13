import { TDNodeType } from '.';
import TDNode from './TDNode';

export default class TreeDoc {
  public idMap: { [key: string]: TDNode } = {};
  public root: TDNode;
  public constructor(rootKey = 'root', public readonly uri: string | null = null) {
    this.root = new TDNode(this, rootKey);
  }

  public static ofArray() {
    const result = new TreeDoc();
    result.root.setType(TDNodeType.ARRAY);
    return result;
  }

  /**
   * Create a TreeDoc with array root node contains the input nodes. This method will mutate the input nodes without
   * copying them. So the original Treedoc and parent associated with nodes will be obsoleted.
   * For idMap merge, if there's duplicated keys, later one will override previous one.
   */
  public static ofNodes(nodes: TDNode[]) {
    const result = new TreeDoc();
    result.root.type = TDNodeType.ARRAY;
    for (const node of nodes) {
      node.setKey(undefined);
      result.idMap = {...result.idMap, ...node.doc.idMap};
      result.root.addChild(node);
    }
    return result;
  }

  /**
   * Build a tree node with exiting node as root node. This method will mutate input node so that the original doc and
   * parent associated with that node will be obsoleted. The that node is still associated with original doc, the original
   * doc will be in invalid state.
   */
  public static ofNode(node: TDNode) {
    const key = node.doc.root.key;
    const result = new TreeDoc(node.doc.root.key, node.doc.uri);
    result.root = node.setKey(key);
    result.idMap = {...node.doc.idMap};
    node.doc = result;
    node.parent = undefined;
    return result;
  }
}

// Jest has problem to access static method. We have to define global method for Jest spec to access
export function TreeDoc_ofArray() {
  return TreeDoc.ofArray();
}

export function TreeDoc_ofNodes(nodes: TDNode[]) {
  return TreeDoc.ofNodes(nodes);
}

export function TreeDoc_ofNode(node: TDNode) {
  return TreeDoc.ofNode(node);
}
