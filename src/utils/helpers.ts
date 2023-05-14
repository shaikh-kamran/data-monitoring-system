/**
 * Contains all helper functions
 */

/**
 * Put an element in a ascending sorted array
 */
export function placeInAscSorted(el: any, arr: any, st: any, en: any, column: string): any {
    st = st || 0;
    en = en || arr.length;
    var pivot = parseInt(st + (en - st) / 2, 10);
    if (en - st <= 1 || arr[pivot][column] === el) return pivot;
    if (arr[pivot][column] < el) {
        return placeInAscSorted(el, arr, pivot, en, column);
    }
    return placeInAscSorted(el, arr, st, pivot, column);
}

/**
 * Put an element in a descending sorted array
 */
export function placeInDescSorted(el: any, arr: any, st: any, en: any, column: string): any {
    st = st || 0;
    en = en || arr.length;
    var pivot = parseInt(st + (en - st) / 2, 10);
    if (en - st <= 1 || arr[pivot][column] === el) return pivot;
    if (arr[pivot][column] > el) {
        return placeInDescSorted(el, arr, pivot, en, column);
    }
    return placeInDescSorted(el, arr, st, pivot, column);
}