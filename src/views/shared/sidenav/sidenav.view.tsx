import React from "react";

import Portal from "src/views/shared/portal/portal.view";
import useSidenavStyles from "src/views/shared/sidenav/sidenav.styles";
import { ReactComponent as AngleDownIcon } from "src/images/icons/angle-down.svg";

interface SidenavProps {
  onClose: () => void;
}

const Sidenav: React.FC<SidenavProps> = ({ children, onClose }) => {
  const classes = useSidenavStyles();
  const sidenavContentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (sidenavContentRef.current) {
      sidenavContentRef.current.focus();
    }
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <Portal type="sidenav">
      <div className={classes.root}>
        <div
          ref={sidenavContentRef}
          className={classes.content}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <button className={classes.hideButton} onClick={onClose}>
            Hide
            <AngleDownIcon className={classes.hideButtonIcon} />
          </button>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Sidenav;
