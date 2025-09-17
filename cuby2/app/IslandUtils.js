
export default function findIslands(allBlocks) {
    const visited = new Set();
    const islands = [];

    for (const block of allBlocks) {
        if (!visited.has(block)) {
            const island = [];
            dfs(block, visited, island, allBlocks);
            islands.push(island);
        }
    }

    return islands;
}

function dfs(current, visited, island, allBlocks) {
    visited.add(current);
    island.push(current);

    const neighbors = findTouchingBlocks(current, allBlocks);
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && neighbor.name === current.name) {
            dfs(neighbor, visited, island, allBlocks);
        }
    }
}

function findTouchingBlocks(block, allBlocks) {
    const touching = [];

    for (const other of allBlocks) {
        if (block !== other && blocksAreTouching(block, other)) {
            touching.push(other);
        }
    }

    return touching;
}

function blocksAreTouching(a, b) {
    const horizontalTouch = (a.x + a.width === b.x || b.x + b.width === a.x) &&
        a.y < b.y + b.height && a.y + a.height > b.y;

    const verticalTouch = (a.y + a.height === b.y || b.y + b.height === a.y) &&
        a.x < b.x + b.width && a.x + a.width > b.x;

    return horizontalTouch || verticalTouch;
}

export function getBlockTouches(a, b) {
    const result = [];
    if (a.y < b.y + b.height && a.y + a.height > b.y) {
        if (a.x + a.width === b.x)
            result.push('right');
        if (b.x + b.width === a.x)
            result.push('left');
    }

    if (a.x < b.x + b.width && a.x + a.width > b.x) {
        if (a.y + a.height === b.y)
            result.push('down');
        if (b.y + b.height === a.y)
            result.push('up');
    }

    return result;
}

export function getIslandTouches(a, b) {
    const result = new Set();
    for (const aa of a) {
        for (const bb of b) {
            const touches = getBlockTouches(aa, bb);
            for (const t of touches)
                result.add(t);
        }
    }
    return [...result];
}

export function getOneToManyIslandTouches(one, many) {
    const result = new Set();
    for (const other of many) {
        const touches = getIslandTouches(one, other);
        for (const t of touches)
            result.add(t);
    }
    return [...result];
}
