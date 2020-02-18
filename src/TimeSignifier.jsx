import React, { PureComponent} from 'react'
import styles from './TimeSlot.css'

export default class HelloWorld extends PureComponent {
  constructor() {
    super()
  }
    render() {
      return (<div className={styles.currTime} style={{marginTop: dynamicMargin}}/>)
    }
}

