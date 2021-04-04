import React, { useEffect, useState, useRef } from "react";
import { SelectorRange, BarRange } from "../../components";
import "./range.scss";

const Range = ({ minPrice, maxPrice }) => {
  // Selection seleccionado
  const [selectedComponent, setSelectedComponent] = useState(null);
  //Prev mouse x Position
  const [oldXMousePosition, setOldXMousePosition] = useState(0);
  // Left component - ROJO
  const [xLeftComponent, setXLeftComponent] = useState(0);
  const [leftComponentValue, setLeftComponentValue] = useState({
    actual: minPrice,
    min: minPrice,
    max: maxPrice,
  });
  // Right component - AZUL
  const [xRightComponent, setXRightComponent] = useState(100);
  const [rightComponentValue, setRightComponentValue] = useState({
    actual: maxPrice,
    min: minPrice,
    max: maxPrice,
  });
  //mouse State
  const [moveAllowed, setMoveAllowed] = useState(false);
  const [prevPosition, setPrevPosition] = useState(0)

  const rangeComponent = useRef(null);
  let xDirection = "";
  let mousedown = (e, selector) => {
    setSelectedComponent(selector);
    setMoveAllowed(true);
  };

  let mousemove = (e) => {
    getMouseDirection(e);
    moveSelector(e);
  };

  let moveSelector = (e) => {
    let percentage = 300 / (maxPrice - minPrice);
    if (moveAllowed) {
      switch (xDirection) {
        case "left":
          moveLeft(percentage);
          return;
        case "right":
          moveRight(e,percentage);
          return;
        default:
          return;
      }
    }
  };

  let moveLeft = (percentage) => {
    if(canMoveLeft()) {
      if (getXComponent() > 0 && getXComponent() % percentage < percentage - 1) {
        setComponentValue()({...getComponentValue(), actual:getComponentValue().actual-=1})
      } else if(getXComponent() === 0) {
        setComponentValue()({...getComponentValue(), actual:minPrice})
      }
      setXComponent()(
        getXComponent() > 0 ? getXComponent() - (percentage - 1) : 0
      );
    }
  };

  let moveRight = (e,percentage) => {
    let percentageA = 100 / (maxPrice - minPrice);
    
   
    //console.log(getXComponent() , percentageA)
    if(canMoveRight()) {
      if(Math.round(getXComponent() - prevPosition) === 1) {
        if ( getXComponent() < 100 ) {
          setComponentValue()({...getComponentValue(), actual:getComponentValue().actual+=1})
        } else if(getXComponent() === 100) {
          setComponentValue()({...getComponentValue(), actual:maxPrice})
        }
        setPrevPosition(Math.round(getXComponent()));
      }
      //if ( getXComponent() < 100 &&  getXComponent() % percentage < percentage - 1 ) {
      // if ( getXComponent() < 100 &&  getXComponent() % percentageA === 0 ) {
      //    setComponentValue()({...getComponentValue(), actual:getComponentValue().actual+=1})
      // } else if(getXComponent() === 100) {
      //   setComponentValue()({...getComponentValue(), actual:maxPrice})
      // }
      // setXComponent()(
      //   getXComponent() < 100 ? getXComponent() + (percentage - 1) : 100
      // );


     // let price80 = Math.round((Math.round(xLeftComponent) * (maxPrice -1) )/100);
      let getValue = minPrice + (maxPrice - minPrice) * (xLeftComponent/100);
     // console.log(((Math.round(xLeftComponent) - minPrice) * 100) / (maxPrice - minPrice));
      //console.log(e.clientX, (e.clientX - 300 - 10 )*100/300)
      setXLeftComponent((e.clientX - 300 - 10)*100/300);

       if ( getXComponent() < 100 ) {
          setComponentValue()({...getComponentValue(), actual:Math.round(getValue)})
        } else if(getXComponent() === 100) {
          setComponentValue()({...getComponentValue(), actual:maxPrice})
        }

      //setXLeftComponent(getXComponent() + ((300/(maxPrice - minPrice)))/10);
     // setXLeftComponent(((getComponentValue().actual - minPrice) * 100) / (maxPrice - minPrice));
    } 
  };

  let canMoveLeft = () => {
    if( selectedComponent.id==='selector-right' ) {
      return rightComponentValue.actual > leftComponentValue.actual +1 ? true : false
    } else {
      return true;
    }
  };

  let canMoveRight = () => {
    if( selectedComponent.id==='selector-left' ) {
      return leftComponentValue.actual < rightComponentValue.actual -1 ? true : false;
    } else {
      return true;
    }
  };

  let setXComponent = () => {
    return selectedComponent?.id === "selector-right"
      ? setXRightComponent
      : setXLeftComponent;
  };
  let getXComponent = () => {
    return selectedComponent?.id === "selector-right"
      ? xRightComponent
      : xLeftComponent;
  };
  let setComponentValue = () =>
    selectedComponent.id === "selector-right"
      ? setRightComponentValue
      : setLeftComponentValue;

  let getComponentValue = () =>
    selectedComponent.id === "selector-right"
      ? rightComponentValue
      : leftComponentValue;

  let getMouseDirection = (e) => {
    if (e.pageX < oldXMousePosition) {
      xDirection = "left";
    } else if (e.pageX > oldXMousePosition) {
      xDirection = "right";
    }
    setOldXMousePosition(e.pageX);
  };

  let mouseup = (e) => {
    setMoveAllowed(false);
  };

  let changePrice = (e) => {
    let newValue =  parseInt(e.target.value);
    if(selectedComponent.id === "selector-left") {
      if(newValue <= 0) { 
        newValue = minPrice;
      } else if(newValue >= rightComponentValue.actual) {
        newValue = rightComponentValue.actual - 1; 
      } 
      setLeftComponentValue({...getComponentValue(), actual:newValue});
      if(newValue < minPrice) {
        setXLeftComponent(((minPrice - minPrice) * 100) / (maxPrice - minPrice));
      } else {
        setXLeftComponent(((newValue - minPrice) * 100) / (maxPrice - minPrice));
      }
    } else if( selectedComponent.id === "selector-right") {
      if(newValue >= 100) { 
        newValue = maxPrice;
      } else if(newValue <= leftComponentValue.actual) {
        newValue = leftComponentValue.actual + 1;
      } 
     
      setRightComponentValue({...getComponentValue(), actual:newValue});
      setXRightComponent(((newValue - minPrice) * 100) / (maxPrice - minPrice));
    }
  };

  return (
    <div
      className="range"
      onMouseMove={(e) => mousemove(e)}
      onMouseUp={(e) => mouseup(e)}
    >
      <div ref={rangeComponent} className="range--component">
        <SelectorRange
          position={xLeftComponent}
          type={"left"}
          minValue={leftComponentValue.min}
          maxValue={leftComponentValue.max}
          actualValue={leftComponentValue.actual}
          mouseDown={mousedown}
          changePrice={changePrice}
        />
        <BarRange />
        <SelectorRange
          position={xRightComponent}
          type={"right"}
          minValue={rightComponentValue.min}
          maxValue={rightComponentValue.max}
          actualValue={rightComponentValue.actual}
          mouseDown={mousedown}
          changePrice={changePrice}
        />
      </div>
    </div>
  );
};

export default Range;
