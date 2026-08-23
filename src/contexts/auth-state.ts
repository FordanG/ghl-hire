type DeferredAuthStateWorkOptions = {
  onError?: (error: unknown) => void;
  schedule?: (callback: () => void) => void;
};

/**
 * Run follow-up Supabase work after an auth-state callback has returned.
 * Supabase holds an exclusive auth lock while invoking the callback, so
 * awaiting another Supabase call from inside it can deadlock sign-in.
 */
export function deferAuthStateWork(
  work: () => Promise<void>,
  options: DeferredAuthStateWorkOptions = {}
): void {
  const schedule = options.schedule ?? ((callback) => setTimeout(callback, 0));
  const onError = options.onError ?? console.error;

  schedule(() => {
    void work().catch(onError);
  });
}
