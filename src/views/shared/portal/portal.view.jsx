import React from "react";
import ReactDOM from "react-dom";
import usePortalStyles from "./portal.styles";

export const PortalSelector = {
  FULLSCREEN_MODAL: "#fullscreen-modal-root",
  SIDENAV: "#sidenav-root",
};

function Portal({ selector = PortalSelector.FULLSCREEN_MODAL, children }) {
  const classes = usePortalStyles();
  const portalRoot = document.querySelector(selector);
  const [divElement] = React.useState(() => {
    const el = document.createElement("div");

    if (selector === PortalSelector.FULLSCREEN_MODAL) {
      el.classList.add(classes.fullScreenModalRoot);
    } else {
      el.classList.add(classes.sidenavRoot);
    }

    return el;
  });

  React.useEffect(() => {
    portalRoot.appendChild(divElement);

    return () => portalRoot.removeChild(divElement);
  }, [portalRoot, divElement]);

  return ReactDOM.createPortal(children, divElement);
}

export default Portal;
