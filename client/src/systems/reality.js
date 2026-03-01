export const LAYER_CONFIG = {
  physical: {
    fog: { color: '#5b9bd5', near: 150, far: 400 },
    sky: { color: '#5b9bd5', sunColor: '#fff5e6', sunIntensity: 1.2 },
    ambient: { color: '#87ceeb', intensity: 0.4 },
    hemisphere: { sky: '#87ceeb', ground: '#4a8c3f', intensity: 0.3 },
    water: { color: '#1a6e8a', opacity: 0.6 },
    sunSphere: '#fff5cc',
    skybox: '#5b9bd5',
  },
  memory: {
    fog: { color: '#2a1a3a', near: 80, far: 300 },
    sky: { color: '#1a1a2e', sunColor: '#8888cc', sunIntensity: 0.6 },
    ambient: { color: '#4444aa', intensity: 0.3 },
    hemisphere: { sky: '#2a2a4a', ground: '#3a2a4a', intensity: 0.2 },
    water: { color: '#2a1a4a', opacity: 0.8 },
    sunSphere: '#8888cc',
    skybox: '#1a1a2e',
  },
}
