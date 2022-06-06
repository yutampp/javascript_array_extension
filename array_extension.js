/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
1次配列をn個に分割する。2次配列として返す。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Array.prototype.cutting = function(n){
  return this.reduce((acc,v,i)=>{
    if(acc[acc.length-1].length>=n){
      acc.push([]);
    }
    acc[acc.length-1].push(v);
    return acc
  },[[]]);
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
1次配列の平均値を返す。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Array.prototype.average = function(){
  return this.reduce((acc,v)=>acc+v)/this.length;
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
nのサンプリング幅で1次配列の単純移動平均を返す。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Array.prototype.sma = function(n){
  const pp = Math.floor(n);
  const self = this;
  return self.map((v,i)=>{
    let st = i-pp < 0 ? 0 : Math.floor(i-pp);
    let en = Math.floor(i+pp )+1;
    let du = self.slice(st,en).length;
    return self.slice(st,en).reduce((acc,v)=>acc+v)/du;
  });
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
nのサンプリング幅で1次配列の単純移動平均をi回行う。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Array.prototype.xsma = function(n,i){
  i = i || 1;
  console.log(n,i)
  if(i<=1) return this.sma(n)
  return this.xsma(n,i-1).sma(n);
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
1次配列の絶対値で一番大きい単一の値を返す。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Array.prototype.max = function(n){
  n = n || 1;
  const temp = this.map(v=>Math.abs(v) );
  const large = function(ARRAY, N ){
    N = Math.floor(N);
    if(N<=0 | ARRAY.length==0) return NaN
    const M = ARRAY.reduce((acc,v)=>acc<v?v:acc);
    const new_array = ARRAY.filter(v=>v!==M);
    return N==1?M:large(new_array,N-1);
  }
  return large(temp,n);
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
ノーマライズを行う。引数の数値が最大値（絶対値）となる。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
Array.prototype.normalize = function(n){
  n = n || 1;
  const max = this.max();
  return this.map(v=>n*v/max);
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
ゼロクロス点で配列を分割する。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function split_zerocross(data){
  let temp = 0;
  let asc = false;
  let sum = [];
  return data.reduce((acc,v,i)=>{
    if(temp > 0 && v < 0) {
      acc.push(sum.concat());
      sum = [];
    }else if(temp < 0 && v > 0){
      acc.push(sum.concat());
      sum = [];
    }
    sum.push(Math.abs(v));
    temp = v;
    return acc
  },[])
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
ゼロクロス点のインデックスと、その間の最大値を返す。
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function detect_zerocross(data){
  let temp = 0;
  let asc = false;
  let sum = [];
  return data.reduce((acc,v,i)=>{
    if(temp > 0 && v < 0) {
      acc.push([sum.max(),i-1]);
      sum = [];
    }else if(temp < 0 && v > 0){
      acc.push([-1 * sum.max(),i-1]);
      sum = [];
    }
    sum.push(Math.abs(v));
    temp = v;
    return acc
  },[1,0])
}
function detect_vertex(data){
  let temp = 0;
  let asc = false;
  return data.reduce((acc,v,i)=>{
    if(temp > v && asc == true ) {
      asc = false;
      acc.push([temp,i==0?0:i-1]);
    }else if(temp < v  && asc == false  ) {
      asc = true;
      acc.push([temp,i==0?0:i-1]);
    }
    temp = v;
    return acc
  },[]);
}
function detect_peak(data){
  return data2 = detect_vertex(data).sort((a,b)=>{
    a=a[0];
    b=b[0];
    if(a<b) return -1
    if(a>b) return 1
    return 0
  }).reverse();
}
function pitch_change(data, pitch, duration){
  const index = Math.floor(data.length/pitch);
  const data2 = new Array(index).fill(0).map((v,i)=>data[ Math.floor(i*data.length/index) ] );
  const data3 = data2.cutting(duration );
  const data4 = new Array(data.length).fill(0);
  data3.forEach((v,i,s)=>{
    const position = Math.floor( data.length * (i/s.length) );
    v.forEach((v,i)=>data4[position+i] = v);
  });
  const data5 = data4.concat();
  data5.unshift(...(new Array(duration).fill(0) ) );
  const data6 = addition(data5,data4);
  return data6
}
function pitch_change2(data, pitch, duration){
  let data2 = detect_vertex(data);
  let data3 = [];
  data2.map((v,i,self)=>{
      const dur = duration;
      const pit = pitch
      const temp = Math.floor(v[1] / dur) * dur + Math.floor((v[1] % dur)/pit);
      data3.push([v[0], temp ] );
      if( Math.floor(v[1] / dur) * dur + dur >  temp +  Math.floor(dur/pit) ){
         data3.push([v[0], temp + Math.floor(dur/pit) ] );
      }
    });
  data3 = data3.sort((a,b)=>a[1]<b[1]?-1:1);
  return liner_trans( data3);
}
function liner_trans(data){
  const result = [0];
  data.forEach(d=>{
    const v = d[0];
    const i = d[1]<0?0:d[1];
    const dur = i - result.length + 1;
    const gap = (v - result[result.length - 1]) / dur;
    new Array(dur).fill(0).forEach(v=>{
      result.push( result[result.length - 1] + gap );
    })
  });  
  return result
}
function pulse_trans(data){
  const result = new Array(data[data.length -1][1]).fill(0);
  data.forEach(d=>{
    const v = d[0];
    const i = d[1];
    result[i] = v;
  });
  return result
}
