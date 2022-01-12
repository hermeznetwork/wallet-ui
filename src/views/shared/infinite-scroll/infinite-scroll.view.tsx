import React from "react";
import { useTheme } from "react-jss";

import Spinner from "src/views/shared/spinner/spinner.view";
import useInfiniteScrollStyles from "src/views/shared/infinite-scroll/infinite-scroll.styles";
import { AsyncTask } from "src/utils/types";
import { Theme } from "src/styles/theme";

const TRESHOLD = 0.9;

interface InfiniteScrollProps {
  asyncTaskStatus: AsyncTask<never, never>["status"];
  onLoadNextPage: (fromItem: number) => void;
  paginationData: Pagination;
}

type Pagination =
  | {
      hasMoreItems: false;
    }
  | {
      hasMoreItems: true;
      fromItem: number;
    };

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  asyncTaskStatus,
  children,
  onLoadNextPage,
  paginationData,
}) => {
  const theme = useTheme<Theme>();
  const classes = useInfiniteScrollStyles();
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (
        ref.current &&
        ref.current.getBoundingClientRect().bottom * TRESHOLD <= window.innerHeight
      ) {
        setShouldLoad(true);
      }
    };

    if (ref) {
      document.addEventListener("scroll", onScroll);

      return () => document.removeEventListener("scroll", onScroll);
    }
  }, [ref, setIsLoading]);

  React.useEffect(() => {
    if (shouldLoad && paginationData.hasMoreItems && !isLoading) {
      setShouldLoad(false);
      setIsLoading(true);
      onLoadNextPage(paginationData.fromItem);
    }
  }, [paginationData, shouldLoad, isLoading, onLoadNextPage, setIsLoading]);

  React.useEffect(() => {
    if (asyncTaskStatus === "successful") {
      setIsLoading(false);
    }
  }, [asyncTaskStatus, setIsLoading]);

  return (
    <div className={classes.root} ref={ref}>
      {children}
      {isLoading && (
        <div className={classes.spinnerWrapper}>
          <Spinner size={theme.spacing(3)} />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
