import { useState, useEffect } from "react";

export function useLocalStorage<T>(defaultValue: T): [T, (newData: T) => void] {
  const [data, setData] = useState<T>(defaultValue);

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const setLocalStorage = (newData: T) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("data", JSON.stringify(newData));
      setData(newData);
    }
  };

  return [data, setLocalStorage];
}
