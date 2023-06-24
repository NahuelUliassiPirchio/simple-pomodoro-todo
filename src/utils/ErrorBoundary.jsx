'use client'
import React from 'react'
import Alert from 'react-bootstrap/Alert'

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError (error) {
    return { hasError: true, error }
  }

  render () {
    if (this.state.hasError) {
      return (
        <Alert variant='warning'>
          <h2>[Error 500] Something went wrong</h2>
        </Alert>
      )
    }
    return this.props.children
  }
}
