export class IDGenerator {
  public generateRequestId(): string {
    const alphabet =
      "bjectSymhasOwnProp-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz";
    let size = 10;
    let id = "";

    while (0 < size--) {
      id += alphabet[(Math.random() * 64) | 0];
    }

    return id;
  }
}
