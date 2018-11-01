import React, { Component } from "react";
import styled from "styled-components";
import { colors } from "../../utils/variables";
import Cell from "./Cell";
class Canvas extends Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      cells: [],
      animPlay: false
    }
  }

  /**
   * After the component has mounted
   */
  componentDidMount() {
    this.gridSize = 15;
    // Request initial animation frame
    this.onAnimFrame();
    this.setState({
      cells: [],
      animPlay: this.props.playActive
    }, () => {
      this.canvas = this.refs.canvas;
      this.squareLen = this.canvas.width / this.gridSize;
      this.ctx = this.canvas.getContext("2d");
      this.setState({
        cells: Array.apply(null, Array(this.gridSize*this.gridSize)).map(() => new Cell(this.ctx, this.squareLen)),
      }, () => {
        this.buffer = Array.apply(null, Array(this.gridSize*this.gridSize)).map(() => {
          return 0;
        });
        this.initialDrawing();
      })
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.playActive !== this.props.playActive) {
      this.setState({
        animPlay: !this.props.playActive
      }, this.onAnimFrame);
      return true
    }
    else {
      return false;
    }
  }

  initialDrawing() {
    const { cells } = this.state;
    this.ctx.beginPath();
    let sqIndex = 0;
    for (let row = 0; row < Math.sqrt(cells.length); row++) {
      for (let column = 0; column < Math.sqrt(cells.length); column++) {
        cells[sqIndex].setCoords(
          column * this.squareLen,
          row * this.squareLen
          );
        cells[sqIndex].draw();
        sqIndex++;
      }
    }
  }
  /**
   * When the component is about to unmount
   */

  componentWillUnmount() {
    // Stop animating
    this.setState({
      animPlay: false,
      cells: []
    });
  }

  fillSquare(e) {
    // Start counting from 0
    const clickedSqX = Math.ceil(e.clientX / this.squareLen) - 1;
    const clickedSqY = Math.ceil(e.clientY / this.squareLen) - 1;
    const cellIndex = clickedSqX + (15 * clickedSqY);
    this.toggleCell(cellIndex);
    const imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(imageData, 0, 0);
  }
  toggleCell(cellIndex) {
    this.state.cells[cellIndex].switchColors();
    this.state.cells[cellIndex].draw();
  }
  toggleAllCells(newCells) {
    for(let i = 0; i < newCells; i++) {

    }
  }
  resetBuffer(buffer) {
    for(let i = 0; i < buffer.length; i++) {
      buffer[i] = 0;
    }
  }
  onAnimFrame(i = 0) {
    // If desired, request another anim frame for later

    if (i > this.state.cells.length - 1) {
      this.toggleAllCells(this.buffer);

      i = 0;
    }

    if (this.state.animPlay) {
      requestAnimationFrame(() => {
          this.onAnimFrame(++i);
      });

        const neighbors = this.checkNeighbors(i);
        if(neighbors < 2 || neighbors >= 4) {
          this.buffer[i] = 0;
        }
        if(neighbors === 3) {
          this.buffer[i] = 1;
        }
        else {
        }
    }
    // TODO animate stuff
  }
  checkNeighbors(i) {
    const { cells } = this.state;
    let numOfNeigbors = 0;
    // current cell
    const cellBool = cells[i].isToggled;
    
    // North Index
    const n = i - this.gridSize;
    // South Index
    const s = i + this.gridSize;
    // north
    if(cells[n] !== undefined && cellBool === cells[n].isToggled) {
      numOfNeigbors++;
    }
    // north-east
    if(cells[n + 1] !== undefined && cellBool === cells[n + 1].isToggled) {
      numOfNeigbors++;
    }
    // north-west
    if(cells[n - 1] !== undefined && cellBool === cells[n - 1].isToggled) {
      numOfNeigbors++;
    }
    // south
    if(cells[s] !== undefined && cellBool === cells[s].isToggled) {
      numOfNeigbors++;
    }
    // south-east
    if(cells[s + 1] !== undefined && cellBool === cells[s + 1].isToggled) {
      numOfNeigbors++;
    }
    // south-west
    if(cells[s - 1] !== undefined && cellBool === cells[s - 1].isToggled) {
      numOfNeigbors++;
    }
    // west
    if(cells[i-1] !== undefined && cellBool === cells[i-1].isToggled) {
      numOfNeigbors++;
    }
    // east
    if(cells[i+1] !== undefined && cellBool === cells[i+1].isToggled) {
      numOfNeigbors++;
    }
    return numOfNeigbors;
  }

  /**
   * Render the canvas
   */
  render() {
    return (
        <canvas width="500" height="500" ref="canvas" onClick = {(e) => {
          this.fillSquare(e);
          }} />
    );
  }
}

export default Canvas;
