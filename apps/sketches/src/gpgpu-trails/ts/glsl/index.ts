import computeShaderPosition from './computeShaderPosition.frag?raw'
import computeShaderVelocity from './computeShaderVelocity.frag?raw'

export const ComputeShader = {
  position: computeShaderPosition,
  velocity: computeShaderVelocity,
}

import pointsFragmentShader from './points.frag?raw'
import pointsVertexShader from './points.vert?raw'

export const PointsShader = {
  vertex: pointsVertexShader,
  fragment: pointsFragmentShader,
}

import lineSegmentsFragmentShader from './lineSegments.frag?raw'
import lineSegmentsVertexShader from './lineSegments.vert?raw'

export const LineSegmentsShader = {
  vertex: lineSegmentsVertexShader,
  fragment: lineSegmentsFragmentShader,
}

import polygonalTrailFragmentShader from './polygonalTrail.frag?raw'
import polygonalTrailVertexShader from './polygonalTrail.vert?raw'

export const PolygonalTrailShader = {
  vertex: polygonalTrailVertexShader,
  fragment: polygonalTrailFragmentShader,
}

import InstancedPolygonalTrailFragmentShader from './InstancedPolygonalTrail.frag?raw'
import InstancedPolygonalTrailVertexShader from './InstancedPolygonalTrail.vert?raw'

export const InstancedPolygonalTrailShader = {
  vertex: InstancedPolygonalTrailVertexShader,
  fragment: InstancedPolygonalTrailFragmentShader,
}
