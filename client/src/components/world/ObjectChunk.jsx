import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { generateObjectsForChunk } from '../../systems/objects'

const _matrix = new THREE.Matrix4()
const _position = new THREE.Vector3()
const _quaternion = new THREE.Quaternion()
const _scale = new THREE.Vector3()

let trunkGeo, foliageGeo1, foliageGeo2, foliageGeo3, rockGeo, climbRockGeo
function getSharedGeometries() {
  if (!trunkGeo) {
    trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 3, 6)
    foliageGeo1 = new THREE.ConeGeometry(1.8, 2.5, 6)
    foliageGeo2 = new THREE.ConeGeometry(1.3, 2, 6)
    foliageGeo3 = new THREE.ConeGeometry(0.8, 1.5, 6)
    rockGeo = new THREE.DodecahedronGeometry(1, 0)
    climbRockGeo = new THREE.CylinderGeometry(0.8, 1.2, 4, 8)
  }
  return { trunkGeo, foliageGeo1, foliageGeo2, foliageGeo3, rockGeo, climbRockGeo }
}

let trunkMat, foliageMat1, foliageMat2, foliageMat3, rockMat
function getPhysicalMaterials() {
  if (!trunkMat) {
    trunkMat = new THREE.MeshLambertMaterial({ color: '#5c3a1e' })
    foliageMat1 = new THREE.MeshLambertMaterial({ color: '#2d5a27' })
    foliageMat2 = new THREE.MeshLambertMaterial({ color: '#3a7a32' })
    foliageMat3 = new THREE.MeshLambertMaterial({ color: '#4a8c3f' })
    rockMat = new THREE.MeshLambertMaterial({ color: '#6b6b6b' })
  }
  return { trunkMat, foliageMats: [foliageMat1, foliageMat2, foliageMat3], rockMat }
}

const climbRockMat = new THREE.MeshLambertMaterial({ color: '#7a6b5a' })

function getMemoryMaterials() {
  return {
    trunkMat: new THREE.MeshLambertMaterial({ color: '#3a2a4a' }),
    foliageMats: [
      new THREE.MeshLambertMaterial({ color: '#2a1a3a' }),
      new THREE.MeshLambertMaterial({ color: '#3a2a5a' }),
      new THREE.MeshLambertMaterial({ color: '#4a3a6a' }),
    ],
    rockMat: new THREE.MeshLambertMaterial({ color: '#5a5a7a' }),
    glowRockMat: new THREE.MeshLambertMaterial({ color: '#8866cc', emissive: '#4422aa', emissiveIntensity: 0.5 }),
  }
}

function setInstanceMatrices(ref, items, getPos) {
  if (!ref.current || items.length === 0) return
  for (let i = 0; i < items.length; i++) {
    const p = getPos(items[i])
    _position.set(p.x, p.y, p.z)
    _scale.set(p.sx, p.sy, p.sz)
    _matrix.compose(_position, _quaternion, _scale)
    ref.current.setMatrixAt(i, _matrix)
  }
  ref.current.instanceMatrix.needsUpdate = true
}

export default function ObjectChunk({ cx, cz, chunkSize, layer = 'physical' }) {
  const trunkRef = useRef()
  const foliage1Ref = useRef()
  const foliage2Ref = useRef()
  const foliage3Ref = useRef()
  const rockRef = useRef()
  const glowRockRef = useRef()
  const climbRef = useRef()

  const data = useMemo(() => {
    const { trunks, foliage, rocks, climbableRocks } = generateObjectsForChunk(cx, cz, chunkSize, layer)
    const geos = getSharedGeometries()
    const mats = layer === 'physical' ? getPhysicalMaterials() : getMemoryMaterials()

    const normalRocks = rocks.filter(r => !r.glow)
    const glowRocks = rocks.filter(r => r.glow)

    return { trunks, foliage, normalRocks, glowRocks, climbableRocks, geos, mats }
  }, [cx, cz, chunkSize, layer])

  const { trunks, foliage, normalRocks, glowRocks, climbableRocks, geos, mats } = data

  useEffect(() => {
    setInstanceMatrices(trunkRef, trunks, t => ({
      x: t.x, y: t.y + t.scale * 1.5, z: t.z, sx: t.scale, sy: t.scale, sz: t.scale
    }))

    const foliageRefs = [foliage1Ref, foliage2Ref, foliage3Ref]
    const offsets = [3.5, 4.5, 5.3]
    foliageRefs.forEach((ref, i) => {
      setInstanceMatrices(ref, foliage, f => ({
        x: f.x, y: f.y + f.scale * offsets[i], z: f.z, sx: f.scale, sy: f.scale, sz: f.scale
      }))
    })

    setInstanceMatrices(rockRef, normalRocks, r => ({
      x: r.x, y: r.y, z: r.z, sx: r.scale, sy: r.scale, sz: r.scale
    }))

    setInstanceMatrices(glowRockRef, glowRocks, r => ({
      x: r.x, y: r.y, z: r.z, sx: r.scale, sy: r.scale, sz: r.scale
    }))

    setInstanceMatrices(climbRef, climbableRocks, r => ({
      x: r.x, y: r.y + r.height * 0.5, z: r.z, sx: r.scale, sy: r.height / 4, sz: r.scale
    }))
  }, [data])

  return (
    <group>
      {trunks.length > 0 && (
        <instancedMesh ref={trunkRef} args={[geos.trunkGeo, mats.trunkMat, trunks.length]} castShadow />
      )}
      {foliage.length > 0 && (
        <>
          <instancedMesh ref={foliage1Ref} args={[geos.foliageGeo1, mats.foliageMats[0], foliage.length]} castShadow />
          <instancedMesh ref={foliage2Ref} args={[geos.foliageGeo2, mats.foliageMats[1], foliage.length]} castShadow />
          <instancedMesh ref={foliage3Ref} args={[geos.foliageGeo3, mats.foliageMats[2], foliage.length]} castShadow />
        </>
      )}
      {normalRocks.length > 0 && (
        <instancedMesh ref={rockRef} args={[geos.rockGeo, mats.rockMat, normalRocks.length]} castShadow />
      )}
      {glowRocks.length > 0 && (
        <instancedMesh ref={glowRockRef} args={[geos.rockGeo, mats.glowRockMat || mats.rockMat, glowRocks.length]} castShadow />
      )}
      {climbableRocks.length > 0 && (
        <instancedMesh ref={climbRef} args={[geos.climbRockGeo, climbRockMat, climbableRocks.length]} castShadow />
      )}
    </group>
  )
}
