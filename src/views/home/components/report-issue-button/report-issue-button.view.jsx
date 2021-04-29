import React from 'react'
import { REPORT_ISSUE_FORM_URL, HERMEZ_HELP_CENTER_URL } from '../../../../constants'

import useReportIssueStyles from './report-issue-button.styles'

function ReportIssueButton () {
  const classes = useReportIssueStyles()

  return (
    <footer className={classes.root}>
      <a
        className={classes.text}
        href={REPORT_ISSUE_FORM_URL}
        target='_blank'
        rel='noopener noreferrer'
      >
        Report an issue
      </a>
      <span className={classes.separator}> | </span>
      <a
        className={classes.text}
        href={HERMEZ_HELP_CENTER_URL}
        target='_blank'
        rel='noopener noreferrer'
      >
        Hermez help center
      </a>
    </footer>
  )
}

export default ReportIssueButton
