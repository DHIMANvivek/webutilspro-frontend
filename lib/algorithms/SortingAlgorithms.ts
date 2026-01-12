export type SortStep = {
    array: number[];          // The current state of the array
    activeIndices: number[];  // Indices currently being compared/processed (Red)
    swapIndices: number[];    // Indices currently being swapped (Yellow)
    sortedIndices: number[];  // Indices that are finalized/sorted (Green)
    pivotIndex?: number;      // Pivot index for QuickSort (Cyan)
};

export type AlgorithmGenerator = (array: number[]) => Generator<SortStep, void, unknown>;

// --- Helper to clone step state ---
const step = (
    array: number[],
    active: number[] = [],
    swaps: number[] = [],
    sorted: number[] = [],
    pivot?: number
): SortStep => ({
    array: [...array],
    activeIndices: active,
    swapIndices: swaps,
    sortedIndices: sorted,
    pivotIndex: pivot,
});

// 1. Bubble Sort
export function* bubbleSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;
    const sorted: number[] = [];

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield step(arr, [j, j + 1], [], [...sorted]);

            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield step(arr, [j, j + 1], [j, j + 1], [...sorted]);
            }
        }
        sorted.unshift(n - i - 1);
        yield step(arr, [], [], [...sorted]);
    }
    yield step(arr, [], [], Array.from({ length: n }, (_, i) => i)); // All sorted
}

// 2. Selection Sort
export function* selectionSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;
    const sorted: number[] = [];

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            yield step(arr, [minIdx, j], [], [...sorted]);
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield step(arr, [i, minIdx], [i, minIdx], [...sorted]);
        }
        sorted.push(i);
        yield step(arr, [], [], [...sorted]);
    }
}

// 3. Insertion Sort
export function* insertionSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;

    // index 0 is trivially sorted
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        yield step(arr, [i], [], []); // Pick key

        while (j >= 0 && arr[j] > key) {
            yield step(arr, [j, j + 1], [], []);
            arr[j + 1] = arr[j];
            yield step(arr, [], [j, j + 1], []);
            j = j - 1;
        }
        arr[j + 1] = key;
        yield step(arr, [j + 1], [], []);
    }
    yield step(arr, [], [], Array.from({ length: n }, (_, i) => i));
}

// 4. Merge Sort
export function* mergeSort(array: number[]): Generator<SortStep> {
    const arr = [...array];

    function* merge(start: number, mid: number, end: number): Generator<SortStep> {
        let left = arr.slice(start, mid + 1);
        let right = arr.slice(mid + 1, end + 1);
        let k = start;
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            yield step(arr, [start + i, mid + 1 + j]);
            if (left[i] <= right[j]) {
                arr[k] = left[i];
                yield step(arr, [], [k]); // Overwrite
                i++;
            } else {
                arr[k] = right[j];
                yield step(arr, [], [k]);
                j++;
            }
            k++;
        }

        while (i < left.length) {
            yield step(arr, [], [k]);
            arr[k++] = left[i++];
        }
        while (j < right.length) {
            yield step(arr, [], [k]);
            arr[k++] = right[j++];
        }
    }

    function* mergeSortHelper(start: number, end: number): Generator<SortStep> {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        yield* mergeSortHelper(start, mid);
        yield* mergeSortHelper(mid + 1, end);
        yield* merge(start, mid, end);
    }

    yield* mergeSortHelper(0, arr.length - 1);
    yield step(arr, [], [], Array.from({ length: arr.length }, (_, i) => i));
}

// 5. Quick Sort
export function* quickSort(array: number[]): Generator<SortStep> {
    const arr = [...array];

    function* partition(low: number, high: number): Generator<SortStep, number> {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            yield step(arr, [j], [], [], high); // Inspect against pivot
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                yield step(arr, [i, j], [i, j], [], high);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield step(arr, [i + 1, high], [i + 1, high], [], high);
        return i + 1;
    }

    function* quickSortHelper(low: number, high: number): Generator<SortStep> {
        if (low < high) {
            const pi = yield* partition(low, high);
            yield* quickSortHelper(low, pi - 1);
            yield* quickSortHelper(pi + 1, high);
        }
    }

    yield* quickSortHelper(0, arr.length - 1);
    yield step(arr, [], [], Array.from({ length: arr.length }, (_, i) => i));
}

// 6. Heap Sort
export function* heapSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;

    function* heapify(n: number, i: number): Generator<SortStep> {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < n) {
            yield step(arr, [l, largest]);
            if (arr[l] > arr[largest]) largest = l;
        }

        if (r < n) {
            yield step(arr, [r, largest]);
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            yield step(arr, [i, largest], [i, largest]);
            yield* heapify(n, largest);
        }
    }

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(n, i);
    }

    // Extract
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Move root to end
        yield step(arr, [0, i], [0, i], [], i); // Mark i as effectively sorted/pivotish
        yield* heapify(i, 0);
    }
    yield step(arr, [], [], Array.from({ length: n }, (_, i) => i));
}

// 7. Shell Sort
export function* shellSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    let n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            yield step(arr, [i]);
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                yield step(arr, [j, j - gap]);
                arr[j] = arr[j - gap];
                yield step(arr, [], [j, j - gap]);
            }
            arr[j] = temp;
            yield step(arr, [], [j]);
        }
    }
    yield step(arr, [], [], Array.from({ length: n }, (_, i) => i));
}


export const ALGORITHMS: Record<string, AlgorithmGenerator> = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Insertion Sort': insertionSort,
    'Merge Sort': mergeSort,
    'Quick Sort': quickSort,
    'Heap Sort': heapSort,
    'Shell Sort': shellSort,
};

export const ALGORITHM_INFO = {
    'Bubble Sort': {
        description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Small elements 'bubble' to the top.",
        complexity: "O(n²)"
    },
    'Selection Sort': {
        description: "Divides the list into a sorted and unsorted region. Repeatedly finds the minimum element from the unsorted region and moves it to the sorted region.",
        complexity: "O(n²)"
    },
    'Insertion Sort': {
        description: "Builds the sorted array one item at a time. It takes each element and inserts it into its correct position within the already sorted part of the array.",
        complexity: "O(n²)"
    },
    'Merge Sort': {
        description: "A Divide and Conquer algorithm. Recursively divides the array into halves until they are size 1, then merges them back together in sorted order.",
        complexity: "O(n log n)"
    },
    'Quick Sort': {
        description: "Picks a 'pivot' element and partitions the array into two sub-arrays: elements less than the pivot and elements greater than the pivot.",
        complexity: "O(n log n)"
    },
    'Heap Sort': {
        description: "Converts the array into a Binary Heap structure. Repeatedly extracts the maximum element from the heap and places it at the end of the array.",
        complexity: "O(n log n)"
    },
    'Shell Sort': {
        description: "A generalization of insertion sort. Sorts elements far apart from each other first, progressively reducing the gap between elements to look at.",
        complexity: "O(n log n) - O(n²)"
    },
};
