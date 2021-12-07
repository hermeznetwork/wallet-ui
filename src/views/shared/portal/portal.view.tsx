import React from "react";
import ReactDOM from "react-dom";

import usePortalStyles from "src/views/shared/portal/portal.styles";

export type PortalSelector = "#fullscreen-modal-root" | "#sidenav-root";

interface PortalProps {
  selector?: PortalSelector;
  children: JSX.Element;
}

function Portal({ selector = "#fullscreen-modal-root", children }: PortalProps): JSX.Element {
  const classes = usePortalStyles();
  const portalRoot = document.querySelector(selector);
  const [divElement] = React.useState(() => {
    const el = document.createElement("div");

    if (selector === "#fullscreen-modal-root") {
      el.classList.add(classes.fullScreenModalRoot);
    } else {
      el.classList.add(classes.sidenavRoot);
    }

    return el;
  });

  React.useEffect(() => {
    if (portalRoot) {
      portalRoot.appendChild(divElement);

      return () => {
        portalRoot.removeChild(divElement);
      };
    }
  }, [portalRoot, divElement]);

  return ReactDOM.createPortal(children, divElement);
}

export default Portal;
