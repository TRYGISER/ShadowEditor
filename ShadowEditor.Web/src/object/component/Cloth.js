/**
 * 布料
 */
function Cloth() {
    var pinsFormation = [];
    var pins = [6];

    pinsFormation.push(pins);

    pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pinsFormation.push(pins);

    pins = [0];
    pinsFormation.push(pins);

    pins = []; // cut the rope ;)
    pinsFormation.push(pins);

    pins = [0, cloth.w]; // classic 2 pins
    pinsFormation.push(pins);

    pins = pinsFormation[1];

    // 材质
    var loader = new THREE.TextureLoader();

    var clothTexture = loader.load('assets/textures/patterns/circuit_pattern.png');
    clothTexture.anisotropy = 16;

    var clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);

    var clothMaterial = new THREE.MeshLambertMaterial({
        map: clothTexture,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    });

    THREE.Mesh.call(this, clothGeometry, clothMaterial);

    this.castShadow = true;

    this.customDepthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: clothTexture,
        alphaTest: 0.5
    });

    this.pins = pins;
    this.clothGeometry = clothGeometry;
}

Cloth.prototype = Object.create(THREE.Mesh.prototype);
Cloth.prototype.constructor = Cloth;

Cloth.prototype.update = function (clock, deltaTime) {
    var time = Date.now();

    var windStrength = Math.cos(time / 7000) * 20 + 40;

    windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
    windForce.normalize()
    windForce.multiplyScalar(windStrength);

    simulate(time, this.clothGeometry, this.pins);

    var p = cloth.particles;
    var clothGeometry = this.clothGeometry;

    for (var i = 0, il = p.length; i < il; i++) {
        clothGeometry.vertices[i].copy(p[i].position);
    }

    clothGeometry.verticesNeedUpdate = true;

    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();
};

export default Cloth;