import { IcosahedronGeometry, Vector3 } from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
export const TEXTURE_SIZE = new Vector3(32, 128)

const originalGeometry = new IcosahedronGeometry(20, 2)
  .deleteAttribute('uv')
  .deleteAttribute('normal')
export const GEOMETRY = BufferGeometryUtils.mergeVertices(originalGeometry)
