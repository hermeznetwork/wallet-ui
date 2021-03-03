import React from 'react'
import { REPORT_ISSUE_FORM_URL } from '../../../../constants'

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
    </footer>
  )
}

export default ReportIssueButton
