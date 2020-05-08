import React from "react";
import './Qrcode.css'
import {getTypeTable, QRPointType} from "../utils/qrcodeHandler";
import {defaultRenderer, defaultViewBox, rand} from "../utils/util";

function listPoint(props) {
    if (!props.qrcode) return []

    const qrcode = props.qrcode;
    const nCount = qrcode.getModuleCount();
    const typeTable = getTypeTable(qrcode);
    const pointList = new Array(nCount);

    let size = 1.03;
    let size2 = 1.03;
    let height = props.params[0];
    let height2 = props.params[1];
    let id = 0;

    const vw = [3, -3];
    const vh = [3, -3];

    const X = [-Math.sqrt(3)/2, 1/2];
    const Y = [ Math.sqrt(3)/2, 1/2];
    const Z = [0, 0];

    const matrixString = 'matrix(' + String(X[0]) + ', ' + String(X[1]) + ', ' + String(Y[0]) + ', ' + String(Y[1]) + ', ' + String(Z[0]) + ', ' + String(Z[1]) + ')'

    if (height <= 0) height = 1.0;
    if (height2 <= 0) height2 = 1.0;

    for (let x = 0; x < nCount; x++) {
        for (let y = 0; y < nCount; y++) {
            if (qrcode.isDark(x, y) == false) continue;
            else if (typeTable[x][y] == QRPointType.POS_OTHER || typeTable[x][y] == QRPointType.POS_CENTER) {
                pointList.push(<rect width={size2} height={size2} key={id++} fill="#FF7F89" x={x + (1 - size2)/2} y={y + (1 - size2)/2} transform={matrixString}/>);
                pointList.push(<rect width={height2} height={size2} key={id++} fill="#FFEBF3" x={0} y={0} transform={matrixString+'translate('+String(x + (1 - size2)/2 + size2)+','+String(y + (1 - size2)/2)+') '+'skewY(45) '}/>);
                pointList.push(<rect width={size2} height={height2} key={id++} fill="#FFD7D9" x={0} y={0} transform={matrixString+'translate('+String(x + (1 - size2)/2)+','+String(y + size2 + (1 - size2)/2)+') '+'skewX(45) '}/>);
            }
            else {
                pointList.push(<rect width={size} height={size} key={id++} fill="#FF7F89" x={x + (1 - size)/2} y={y + (1 - size)/2} transform={matrixString}/>);
                pointList.push(<rect width={height} height={size} key={id++} fill="#FFEBF3" x={0} y={0} transform={matrixString+'translate('+String(x + (1 - size)/2 + size)+','+String(y + (1 - size)/2)+') '+'skewY(45) '}/>);
                pointList.push(<rect width={size} height={height} key={id++} fill="#FFD7D9" x={0} y={0} transform={matrixString+'translate('+String(x + (1 - size)/2)+','+String(y + size + (1 - size)/2)+') '+'skewX(45) '}/>);
            }
        }
    }

    return pointList;
}

function viewBox(qrcode) {
    if (!qrcode) return '0 0 0 0';

    const nCount = qrcode.getModuleCount();
    return String(-nCount) + ' ' + String(-nCount / 2) + ' ' + String(nCount * 2) + ' ' + String(nCount * 2);
}

export default class QrRenderer25D extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.setParamInfo) {
            this.props.setParamInfo([
                {
                    key: '柱体高度',
                    default: 0.5,
                },
                {
                    key: '定位点柱体高度',
                    default: 0.5,
                },
                ]
            );
        }
    }

    render() {
        return (
            <svg className="Qr-item-svg" width="100%" height="100%" viewBox={viewBox(this.props.qrcode)} fill="white"
                 xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                {listPoint(this.props)}
            </svg>
        );
    }
}

