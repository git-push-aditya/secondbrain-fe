export const minEndingIndex = (link: string): number => {
    const positions = [
        link.indexOf('.com') === -1 ? Infinity : link.indexOf('.com') + 4,
        link.indexOf('.in') === -1 ? Infinity : link.indexOf('.in') + 3,
        link.indexOf('.org') === -1 ? Infinity : link.indexOf('.org') + 4,
        link.indexOf('.net') === -1 ? Infinity : link.indexOf('.net') + 4,
        link.indexOf('.info') === -1 ? Infinity : link.indexOf('.info') + 5,
        link.indexOf('.biz') === -1 ? Infinity : link.indexOf('.biz') + 4,
        link.indexOf('.app') === -1 ? Infinity : link.indexOf('.app') + 4,
        link.indexOf('.xyz') === -1 ? Infinity : link.indexOf('.xyz') + 4,
    ];

    const minPos = Math.min(...positions);
    return minPos;

}