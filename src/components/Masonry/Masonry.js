import React from 'react'

import Grid from 'elements/Grid/Grid'

import styles from './Masonry.module.css'

/**
 * This is not a real masonry layout: we don't actually measure
 * the column heights (which is expensive), but simply distribute
 * children on available fields. This should work ok as long
 * as there are not huge differences in abstract length.
 */
class Masonry extends React.Component {
  state = {
    columnCount: 0,
  }

  columns = []

  componentDidMount() {
    this.resizeColumns()
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  }

  resizeColumns = () => {
    if (window.innerWidth > 1200) {
      this.setState({ columnCount: 3 })
    } else if (window.innerWidth > 800) {
      this.setState({ columnCount: 2 })
    } else {
      this.setState({ columnCount: 1 })
    }
  }

  onWindowResize = () => {
    requestAnimationFrame(() => {
      this.resizeColumns()
    })
  }

  render() {
    // When server rendering static html, we don't know the window width,
    // so we just render a grid
    if (!this.state.columnCount) {
      return <Grid>{this.props.children}</Grid>
    }

    this.columns = Array(this.state.columnCount).fill([])

    React.Children.forEach(this.props.children, (child, i) => {
      const col = i % this.state.columnCount
      this.columns[col] = this.columns[col].concat(
        React.cloneElement(child, { className: styles.item })
      )
    })

    return (
      <div className={styles.container}>
        {this.columns.map((column, i) => (
          <div className={styles.column} key={i}>
            {column}
          </div>
        ))}
      </div>
    )
  }
}

export default Masonry
