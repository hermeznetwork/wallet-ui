import React from "react";

import useReportIssueStyles from "src/views/home/components/report-issue-button/report-issue-button.styles";
import { REPORT_FEEDBACK_FORM_URL, HERMEZ_HELP_CENTER_URL } from "src/constants";

function ReportIssueButton(): JSX.Element {
  const classes = useReportIssueStyles();

  return (
    <footer className={classes.root}>
      <a
        className={classes.text}
        href={REPORT_FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Report an issue
      </a>
      <span className={classes.separator}>|</span>
      <a
        className={classes.text}
        href={HERMEZ_HELP_CENTER_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Polygon Hermez help center
      </a>
    </footer>
  );
}

export default ReportIssueButton;
