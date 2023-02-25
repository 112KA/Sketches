import { IcosahedronGeometry, Vector3 } from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
export const TEXTURE_SIZE = new Vector3(16, 252)

const originalGeometry = new IcosahedronGeometry(20, 4)
  .deleteAttribute('uv')
  .deleteAttribute('normal')
export const GEOMETRY = BufferGeometryUtils.mergeVertices(originalGeometry)
