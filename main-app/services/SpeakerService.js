const fs = require('fs');
const util = require('util');
const axios = require('axios')
/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching speakers information
 */
class SpeakerService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the speakers data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of speakers name and short name
   */
  async getNames() {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`
    })
  }

  /**
   * Get all artwork
   */
  async getAllArtwork() {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork`
    })
  }

  /**
   * Get all artwork of a given speaker
   * @param {*} shortname The speakers short name
   */
  async getArtworkForSpeaker(shortname) {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortname}`
    })
  }

  /**
   * Get speaker information provided a shortname
   * @param {*} shortname
   */
  async getSpeaker(shortname) {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speakers/${shortname}`
    })
  }

  /**
   * Returns a list of speakers with only the basic information
   */
  async getListShort() {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`
    })
  }

  /**
   * Get a list of speakers
   */
  async getList() {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`
    })
  }

  async getImage(path) {
    const {  ip, port } = await this.getService('speakers-service')
    return this.callService({
      method: 'get',
      responseType: 'stream',
      url: `http://${ip}:${port}/images/${path}`
    })
  }
  /**
   * Fetches speakers data from the JSON file provided to the constructor
   */
  async callService (reqOptions) {
    const response = await axios(reqOptions)
    return response.data
   }

   async getService (serviceName) {
     const response = await axios.get(`http://localhost:5000/find/${serviceName}/1`)
     return response.data
   }
}

module.exports = SpeakerService;
