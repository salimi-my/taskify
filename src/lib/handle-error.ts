import * as z from 'zod';
import { isRedirectError } from 'next/dist/client/components/redirect';

export function getErrorMessage(error: unknown) {
  const unknownError = 'Uh oh! Something went wrong.';

  if (error instanceof z.ZodError) {
    const errors = error.issues.map((issue) => {
      return issue.message;
    });
    return errors.join('\n');
  } else if (error instanceof Error) {
    return error.message;
  } else if (isRedirectError(error)) {
    throw error;
  } else {
    return unknownError;
  }
}
