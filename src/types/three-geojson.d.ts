declare module 'three-geojson' {
  import type { LineSegments, Mesh } from 'three'

  export class GeoJSONLoader {
    fetchOptions: Record<string, unknown>
    loadAsync(url: string): Promise<any>
    parse(content: string | object): any
    static getLineObject(objects: Array<any>, options?: Record<string, unknown>): LineSegments
    static getMeshObject(objects: Array<any>, options?: Record<string, unknown>): Mesh
  }
}

