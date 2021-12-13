import React from "react";
import ReactDOM from "react-dom";

import usePortalStyles from "src/views/shared/portal/portal.styles";

interface PortalProps {
  type?: "full-screen" | "sidenav";
}

const Portal: React.FC<PortalProps> = ({ type = "full-screen", children }) => {
  const classes = usePortalStyles();
  const selector = type === "full-screen" ? "#fullscreen-modal-root" : "#sidenav-root";
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
};

export default Portal;
