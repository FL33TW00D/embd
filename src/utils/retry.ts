/**
 * Retry a function until it succeeds or the number of retries is reached.
 */
export async function retry<T>(
    callback: () => Promise<T>,
    { retries }: { retries: number }
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await callback();
        } catch (error) {
            if (i === retries - 1) {
                console.error("Retries exhausted, throwing error: ", error);
                throw error;
            } else {
                console.warn("Retrying after error: ", error);
            }
        }
    }

    // Just to make the TypeScript compiler happy.
    throw new Error("Unreachable");
}
