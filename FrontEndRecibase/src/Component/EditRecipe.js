import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import BodyHome from './BodyHome';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { DetailItem } from '../actions'
import axios from 'axios'
class EditRecipe extends Component {
  constructor() {
    super();
    this.state = {
      view: 'asd', arrbahan: [], arrbahanId: [], objbahan: { nama: '', jumlah: 0, satuan: '', resep_Id: 0 },
      objbumbu: { nama: '', jumlah: 0, satuan: '', resep_Id: 0, bumbu_Id: 0 },
      bahancounter: 0, arrbumbu: [], bumbucounter: 0, arralat: [],
      isValid: '', resepid: 0, reseplength: [], objalat: { nama: '', resep_Id: 0 }, alatcounter: 0
    };
  }

  componentWillMount() {
    axios.get(`http://localhost:3300/data/details/${this.props.selectedID}`)
      .then((getdata) => {
        this.setState({ ...this.state, RecipeList2: getdata.data });
        // console.log('axios get bodyhome',this.state.RecipeList2)
        // console.log('propid', this.props.selectedID)
        // console.log('namaresep', this.state.RecipeList2.resep[0][0].recipe_name)
        this.props.DetailItem({
          namaresep: this.state.RecipeList2.resep[0][0].recipe_name,
          bahan: this.state.RecipeList2.resep[2], bumbu: this.state.RecipeList2.resep[3],
          alat: this.state.RecipeList2.resep[1], step: this.state.RecipeList2.resep[0][0].recipe_steps,
          tipe: this.state.RecipeList2.resep[0][0].type_of_dish
        })

      })
  }



  componentWillUpdate() {
    if (this.state.isValid === true) {
      this.setState({ isValid: false })
    }
  }

  bahansubmit = (key) => {
    let objbahan = { ...this.state.objbahan };
    objbahan.bahan_Id = this.props.bahan[key].bahan_Id;
    objbahan.nama = this.refs.namabahan.value;
    objbahan.jumlah = parseInt(this.refs.jumlahbahan.value);
    objbahan.satuan = this.refs.satuanbahan.value;
    objbahan.resep_Id = this.props.selectedID;

    this.setState({ objbahan }, () => {
      let arrbahan = this.props.bahan

      console.log('ini let arrbahan', arrbahan)
      arrbahan[key] = this.state.objbahan;
      console.log('ini let arrbahan2', arrbahan)
      console.log('ini state arrbahanId', this.state.arrbahanId)
      console.log('ini props bahan', this.props.bahan)
      console.log(this.state.objbahan)
      this.setState({ isValid: true })
    });
    // this.setState({ bahancounter: 1 })

    // if (this.state.bahancounter === 1) {
    //   let arrbahan = this.props.bahan
    //   console.log('ini let arrbahan', arrbahan)
    //   arrbahan[key] = this.state.objbahan;
    //   console.log('ini let arrbahan2', arrbahan)
    //   console.log('ini props bahan', this.props.bahan)
    //   console.log('ini arrbahan state', this.state.arrbahan)
    //   console.log(this.state.objbahan)
    //   this.setState({ bahancounter: 0 })

    // }


  }

  bumbusubmit = (key) => {
    let objbumbu = { ...this.state.objbumbu };
    objbumbu.bumbu_Id = this.props.bumbu[key].bumbu_Id;
    objbumbu.nama = this.refs.namabumbu.value;
    objbumbu.jumlah = this.refs.jumlahbumbu.value;
    objbumbu.satuan = this.refs.satuanbumbu.value;
    objbumbu.resep_Id = this.state.resepid;
    this.setState({ objbumbu }, () => {
      let arrbumbu = this.props.bumbu
      arrbumbu[key] = this.state.objbumbu;
      console.log(this.state.objbumbu)
      this.setState({ isValid: true })
    });

  }

  alatsubmit = (key) => {
    let objalat = { ...this.state.objalat };
    objalat.alat_Id = this.props.alat[key].alat_Id;    
    objalat.nama = this.refs.namaalat.value;
    objalat.resep_Id = this.state.resepid;
    this.setState({ objalat }, () => {
      let arralat = this.props.alat
      arralat[key] = this.state.objalat;
      console.log(this.state.objalat)
      this.setState({ isValid: true })
    });
    //   this.setState({ arralat: [...this.state.arralat, this.refs.namaalat.value] })
    // console.log(this.state.arralat) 
    // console.log(...this.state.arralat) 


  }

  handleSubmit = (event) => {
    console.log('ini bahan', this.state.arrbahan)
    console.log('ini bumbu', this.state.arrbumbu)
    console.log('ini alat', this.state.arralat)
    axios.post(`http://localhost:3300/update/${this.props.selectedID}`,
      {
        inputNamaResep: this.refs.recipename.value,
        inputbahan: this.props.bahan,
        inputbumbu: this.props.bumbu,
        inputalat: this.props.alat,
        inputstep: this.refs.step.value,
        inputjenis: this.refs.jenishidangan.value,
        inputuser: this.props.id
      }).then(alert('Recipe Edited!'))

      .catch((err) => { console.log(err); })
    return <Redirect to='./' />
  }

  render() {
    const bahan = this.props.bahan.map((item, index) => {
      return (
        <li key={index}>{item.nama} {item.jumlah} {item.satuan}<span> </span>
          <input type="button" value="submit" onClick={() => { this.bahansubmit(index) }} /></li>

      )
    })

    const bumbu = this.props.bumbu.map((item, index) => {

      return (<li key={index}>{item.nama} {item.jumlah} {item.satuan}<span> </span>
        <input type="button" value="submit" onClick={() => { this.bumbusubmit(index) }} /></li>)
    })

    const alat = this.props.alat.map((item, index) => {
      return (
        <li key={index}>{item.nama}<span> </span>
          <input type="button" value="submit" onClick={() => { this.alatsubmit(index) }} />
        </li>)
    })
    return (
      // <!-- Page Content -->
      <div className="container">
        <form id="Recipeform" onSubmit={() => this.handleSubmit()}>
          {/* <!-- Portfolio Item Heading --> */}
          <h1 className="my-4">Nama Resep ({this.props.namaresep})<input type='text' className="form-control" id="recipe" ref="recipename" defaultValue={this.props.namaresep} />
          </h1>

          {/* <!-- Portfolio Item Row --> */}
          <div className="row">

            <div className="col-md-3">
              <p>Gambar Makanan <input type='file' /></p>
            </div>

            <div className="col-md-8">
              <h3 className="my-8">Bahan</h3>
              <ul>
                {bahan}
                <input type='text' ref='namabahan' />
                <input type='number' ref='jumlahbahan' />
                <input type='text' ref='satuanbahan' />
              </ul>

              <h3 className="my-8">Bumbu</h3>
              <ul>
                {bumbu}
                <input type='text' ref='namabumbu' /><input type='number' ref='jumlahbumbu' /><input type='text' ref='satuanbumbu' />
              </ul>

              <h3 className="my-8">Alat</h3>
              <ul>
                {alat}
                <input type='text' ref='namaalat' />
              </ul>
              <h3 className="my-8">Jenis Hidangan</h3> {this.props.tipe}<input type='text' ref='jenishidangan' defaultValue={this.props.tipe} />

            </div>


          </div>
          <h3 className="my-3">Cara Membuat</h3>
          <textarea style={{ width: 700, height: 200 }} ref='step' defaultValue={this.props.step}></textarea>
          <p><input type="submit" className="btn btn-lg btn-primary btn-block mt-2" value="Enter Recipe!" /></p>
        </form>
      </div>


    );
  }
}

const mapStateToProps = (state) => {
  return { tipe: state.DataDetail.tipe, namaresep: state.DataDetail.namaresep, bahan: state.DataDetail.bahan, bumbu: state.DataDetail.bumbu, alat: state.DataDetail.alat, step: state.DataDetail.step, selectedID: state.IDselector.ID };
};

export default connect(mapStateToProps, { DetailItem })(EditRecipe);