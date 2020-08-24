/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/** An observable 2D numerically indexed collection. */
export interface IMatrixProducer<T> {
    /**
     * Acquire a reader for this matrix's values and implicitly subscribe the consumer
     * to value change notifications.
     * 
     * @param consumer - The consumer to be notified of matrix changes.
     */
    openMatrix(consumer: IMatrixConsumer<T>): IMatrixReader<T>;

    /**
     * Unsubscribe the consumer from this matrix's change notifications.
     * 
     * @param consumer - The consumer to unregister from the matrix.
     */
    closeMatrix(consumer: IMatrixConsumer<T>): void;
}

/** Capability to read cells in a matrix. */
export interface IMatrixReader<T> {
    readonly rowCount: number;
    readonly colCount: number;
    getCell(row: number, col: number): T;

    /**
     * A reference to the underlying producer that provides values for this reader,
     * or undefined if the producer is immutable.
     */
    readonly matrixProducer?: IMatrixProducer<T>;
}

/** Capability to write cells in a matrix. */
export interface IMatrixWriter<T> {
    setCell(row: number, col: number, value: T): void;
}

/** A consumer of change notifications for a matrix. */
export interface IMatrixConsumer<T> {
    /** Notification that rows have been inserted, removed, and/or replaced in the given matrix. */
    rowsChanged(rowStart: number, removedCount: number, insertedCount: number, producer: IMatrixProducer<T>): void;

    /** Notification that cols have been inserted, removed, and/or replaced in the given matrix. */
    colsChanged(colStart: number, removedCount: number, insertedCount: number, producer: IMatrixProducer<T>): void;

    /**
     * Notification that a range of cells have been replaced in the given matrix.  If the source
     * matrix has the new cell values already in an array, it may optionally pass these to consumers
     * as an optimization.
     */
    cellsChanged(rowStart: number, colStart: number, rowCount: number, colCount: number, producer: IMatrixProducer<T>): void;
}

export interface MatrixIteratorSpec {
    /**
     * Iterates over empty cells.
     */
    includeEmpty?: boolean;
    /**
     * Row start position of iteration.
     */
    rowStart?: number;
    /**
     * Col start position of iteration.
     */
    colStart?: number;
    /**
     * Number of rows to iterate over.
     */
    rowCount?: number;
    /**
     * Number of columns to iterate over.
     */
    colCount?: number
}

export interface IMatrixIterator<T> {
    /**
     * Iterate over cells in the matrix.
     * @param callback

     * @param spec Iteration spec to constrain behaviour. When a spec
     * is not provided the default behaviour should be:
     *
     * {
     *   includeEmpty: false,
     *   rowStart: 0,
     *   colStart: 0,
     *   rowCount: matrix.rowCount,
     *   colCount: matrix.colCount,
     * }
     *
     */
    forEachCell(callback: (value: T, row: number, column: number) => void, spec?: MatrixIteratorSpec): void;
}
