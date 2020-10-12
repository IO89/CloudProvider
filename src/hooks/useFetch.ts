import * as React from "react";
import { useState, useEffect, useReducer } from "react";

export enum LoaderStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

type IdleState = { status: LoaderStatus.Idle };
type LoadingState = { status: LoaderStatus.Loading };
type LoadedState<T> = { status: LoaderStatus.Success; data: T };
type ErrorState = { status: LoaderStatus.Error; error: unknown };

type CombinedLoadingState<T> =
  | IdleState
  | LoadedState<T>
  | LoadingState
  | ErrorState;

type ReturnValue<T> = [
  CombinedLoadingState<T>,
  React.Dispatch<React.SetStateAction<string>>
];

export const useFetch = <T>(initialUrl: string): ReturnValue<T> => {
  const reducer = (
    oldsState: CombinedLoadingState<T>,
    newState: CombinedLoadingState<T>
  ): CombinedLoadingState<T> => {
    if (newState.status === LoaderStatus.Idle) {
      return { status: LoaderStatus.Idle };
    } else {
      return {
        ...oldsState,
        ...newState,
      };
    }
  };

  const [url, setUrl] = useState<string>(initialUrl);
  const [response, setResponse] = useReducer(reducer, {
    status: LoaderStatus.Idle,
  });

  const fetchData = async (fetchUrl: string, signal: AbortSignal) => {
    setResponse({ status: LoaderStatus.Loading });

    try {
      const result = await fetch(fetchUrl, { signal });
      const data = await result.json();

      setResponse({ status: LoaderStatus.Success, data });
    } catch (error) {
      setResponse({ status: LoaderStatus.Error, error });
    }
  };

  useEffect(() => {
    // We are using experimental AbortController to prevent setting state of unmounted component
    // https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (url) {
      fetchData(url, signal);
    }

    return () => {
      abortController.abort();
    };
  }, [url]);

  return [response, setUrl];
};

export default useFetch;
