function generateCircle(count, centerX, centerY, size){
  const positions=[]
  for(let i=0;i<count;i++){
    const angle=(i/count) * 2 * Math.PI
    positions.push({
      x: centerX + size * Math.cos(angle),
      y: centerY + size * Math.sin(angle),
    })
  }
  return positions
}

function generateHeart(count, centerX, centerY, size){
  const positions=[]
  for(let i=0;i<count;i++){
    const t=(i/count) * 2 * Math.PI
    const x=16 * Math.pow(Math.sin(t), 3)
    const y=13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)
    positions.push({
      x: centerX + x * (size/16),
      y: centerY - y * (size/16),
    })
  }
  return positions
}

function generateStar(count, centerX, centerY, size){
  const positions=[]
  const outerR=size
  const innerR=size * 0.45
  const totalVertices=10

  for(let i=0;i<count;i++){
    const t=(i/count) * totalVertices
    const vIndex=Math.floor(t)
    const frac=t - vIndex

    const angle1=(vIndex/totalVertices) * 2 * Math.PI - Math.PI/2
    const angle2=((vIndex+1)/totalVertices) * 2 * Math.PI - Math.PI/2
    const r1=vIndex % 2===0 ? outerR : innerR
    const r2=(vIndex+1) % 2===0 ? outerR : innerR

    const x1=r1 * Math.cos(angle1)
    const y1=r1 * Math.sin(angle1)
    const x2=r2 * Math.cos(angle2)
    const y2=r2 * Math.sin(angle2)

    positions.push({
      x: centerX + x1 + (x2 - x1) * frac,
      y: centerY + y1 + (y2 - y1) * frac,
    })
  }
  return positions
}

function generateCloud(count, centerX, centerY, size){
  const positions=[]
  const width=size * 1.6
  const height=size * 0.9

  for(let i=0;i<count;i++){
    const angle=(i/count) * 2 * Math.PI
    const bump=1 + Math.sin(angle * 4) * 0.18
    const rx=(width/2) * bump
    const ry=height/2

    positions.push({
      x: centerX + rx * Math.cos(angle),
      y: centerY + ry * Math.sin(angle) * 0.7 - height * 0.1,
    })
  }
  return positions
}

const shapeGenerators={
  circle:generateCircle,
  heart:generateHeart,
  star:generateStar,
  cloud:generateCloud,
}

export default shapeGenerators