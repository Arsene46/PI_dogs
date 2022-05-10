import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTemperaments, createBreed, changeNewTemp, emptyDetail, updateBreed, getBreedDetail } from '../../actions';
import s from "./BreedCreation.module.css";
import sc from "../Card/Card.module.css";
import defaultImg from "../../images/defaultDog.png";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const isImg = /^http[^]*.(jpg|jpeg|gif|png|tiff|bmp)((.*))?$/gmi;
const defaultInput = { name: "", hMin: "", hMax: "", wMin: "", wMax: "", lMin: "", lMax: "", img: "", temperaments: [] };

export default function BreedCreation({ modify = false }) {
  const [input, setInput] = React.useState(defaultInput);
  const [errors, setErrors] = React.useState({});
  const [searchTemp, setSearchTemp] = React.useState("");

  const dispatch = useDispatch();
  const { id } = useParams();
  React.useEffect(() => {
    dispatch(getAllTemperaments());
    if (modify) {
      dispatch(getBreedDetail(id));
    }
    return () => {
      setInput({ ...defaultInput, temperaments: [] });
      dispatch(emptyDetail());
    }
  }, [dispatch, id, modify]);



  const returnToHome = useNavigate();
  const b = useSelector(state => state.breedDetail);
  React.useEffect(() => {
    if (modify) {
      const h = b.height ? b.height.split(" - ") : [""];
      const w = b.weight ? b.weight.split(" - ") : [""];
      const l = b.life_span ? b.life_span.split(" - ") : [""];
      setInput({
        name: b.name ? b.name : "",
        hMin: h[0],
        hMax: h[h.length - 1],
        wMin: w[0],
        wMax: w[w.length - 1],
        lMin: l[0],
        lMax: l[l.length - 1],
        img: b.image ? b.image : "",
        temperaments: b.temperaments ? b.temperaments : []
      })
    } else setInput({ ...defaultInput, temperaments: [] });
  }, [b, modify]);

  const temperaments = useSelector(state => state.temperaments);
  const newTemp = useSelector(state => state.newTemp);

  React.useEffect(() => {
    if (newTemp) {
      dispatch(getAllTemperaments());
      dispatch(changeNewTemp());
    }
  }, [newTemp, dispatch]);

  const handleInputChange = function (e) {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors(validate({ ...input, [e.target.name]: e.target.value }, e.target.name));
  }

  const validate = (input, name) => {
    let error = errors;
    delete error[name];
    if (name === "name") {
      if (!input.name) error.name = 'Breed name is required!';
      else if (input.name.length > 25) error.name = 'Breed name is too looooong!';
    }
    if (name[1] === "M") {
      const errName = name[0] + "MinMax";
      const min = parseFloat(input[name[0] + "Min"]);
      const max = parseFloat(input[name[0] + "Max"]);
      if (min < 0 || max < 0) {
        error[errName] = 'Negative numbers are not allowed!';
      } else if (min === 0 || max === 0) {
        error[errName] = '0 is not allowed!';
      } else if (min > max) {
        error[errName] = 'Min cannot be greater than Max!';
      } else if (min > 999999999 || max > 999999999) {
        error[errName] = 'Number is too large!';
      } else delete error[errName];
    }
    if (name === "img" && input.img && input.img.match(isImg) === null) {
      error.img = 'Invalid url!';
    }
    return error;
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    const height = input.hMin === input.hMax ? input.hMin : input.hMin + " - " + input.hMax;
    const weight = input.wMin === input.wMax ? input.wMin : input.wMin + " - " + input.wMax;
    let life_span = undefined;
    if (input.lMin && input.lMax) {
      life_span = input.lMin === input.lMax ? input.lMin : input.lMin + " - " + input.lMax;
    } else if (input.lMin || input.lMax) life_span = input.lMin || input.lMax;
    const newBreed = { name: input.name, height, weight, life_span, image: input.img || undefined, temperaments: input.temperaments };

    if (!modify) dispatch(createBreed(newBreed));
    else dispatch(updateBreed(newBreed, b.id));
    setInput({ ...defaultInput, temperaments: [] });
    setSearchTemp("");

    if (modify) returnToHome("/home");
  }

  const handleClear = () => {
    setInput({ ...defaultInput, temperaments: [] });
    setErrors({});
    setSearchTemp("");
  }

  const handleSearchTemp = (e) => {
    setSearchTemp(e.target.value);
  }

  const handleAddTemp = () => {
    let newTemp = searchTemp?.split(" ").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    if (searchTemp && !input.temperaments.includes(newTemp)) {
      setInput({ ...input, temperaments: [...input.temperaments, newTemp] });
    }
    setSearchTemp("");
  }

  const handleDropTemp = (e) => {
    const newState = { ...input };
    newState.temperaments = newState.temperaments.filter(t => t !== e.target.value);
    setInput(newState);
  }

  const handleTempChange = (e) => {
    const newState = { ...input };
    if (!input.temperaments.includes(e.target.value)) {
      newState.temperaments.push(e.target.value);
    } else newState.temperaments = newState.temperaments.filter(t => t !== e.target.value);
    setInput(newState);
  }

  return (
    <div className={!modify ? s.breedCreation : `${s.breedCreation} ${s.modifyBigBackground}`}>
      {/* ----------------------------------Card----------------------------------- */}
      <div className={!modify ? `${sc.card} ${s.creationCard}` : `${sc.card} ${s.creationCard} ${s.modify}`}>
        <img className={sc.image} src={input.img && !errors.img ? input.img : defaultImg} alt="Not found!" onError={() => setErrors({ ...errors, img: 'Invalid url!' })} />
        <div>
          {!errors.name && input.name ?
            <h3 className={sc.name}>{input.name.split(" ")?.map(w => ((w[0]?.toUpperCase()) || "") + (w.slice(1)?.toLowerCase() || "")).join(" ")}</h3>
            : <p>This dog breed doesn't have a name.</p>
          }
          {!errors.wMinMax && input.wMin && input.wMax ?
            <p><b>Weight:</b> {input.wMin === input.wMax ? input.wMin : input.wMin + " - " + input.wMax} kg</p>
            : <p>The weight of this dog breed is unknown.</p>
          }

          {input.temperaments?.length ?
            <p><b>Temperaments:</b> {input.temperaments?.join(", ")}</p>
            : <p>This dog breed doesn't have any temperaments.</p>
          }
        </div>
      </div>
      {/* ---------------------------------Form-------------------------------------- */}
      <div className={!modify ? s.form : `${s.form} ${s.modify}`}>
        <form onSubmit={handleSubmit} autoComplete="off">
          {!modify ?
            <h2>Create a new dog breed</h2>
            : <h2>Modify breed</h2>
          }
          <div className={s.divInputs}>
            <p className={s.words}>*Breed name</p>
            <input type="text" name="name" value={input.name} maxLength="30"
              placeholder='Type breed name...' onChange={handleInputChange}
              className={errors.name ? `${s.inputBox} ${s.dangerBox}` : s.inputBox} />
            {errors.name && (<p className={s.danger}><b>{errors.name}</b></p>)}
          </div>
          <div className={s.divInputs}>
            <p className={s.words}>*Height (cm)</p>
            <input type="number" name="hMin" value={input.hMin}
              placeholder='Min...' onChange={handleInputChange}
              className={errors.hMinMax ? `${s.inputBox} ${s.min} ${s.dangerBox}` : `${s.inputBox} ${s.min}`}
              min="0" max="999999999" />
            <input type="number" name="hMax" value={input.hMax}
              placeholder='Max...' onChange={handleInputChange}
              className={errors.hMinMax ? `${s.inputBox} ${s.max} ${s.dangerBox}` : `${s.inputBox} ${s.max}`}   //className={errors.hMinMax && this.value && 'danger'}
              min="0" max="999999999" />
            {errors.hMinMax && (<p className={s.danger}><b>{errors.hMinMax}</b></p>)}
          </div>
          <div className={s.divInputs}>
            <p className={s.words}>*Weight (kg)</p>
            <input type="number" name="wMin" value={input.wMin} maxLength="12"
              placeholder='Min...' onChange={handleInputChange} step=".01"
              className={errors.wMinMax ? `${s.inputBox} ${s.min} ${s.dangerBox}` : `${s.inputBox} ${s.min}`}
              min="0" max="999999999" />
            <input type="number" name="wMax" value={input.wMax} maxLength="12"
              placeholder='Max...' onChange={handleInputChange} step=".01"
              className={errors.wMinMax ? `${s.inputBox} ${s.max} ${s.dangerBox}` : `${s.inputBox} ${s.max}`}
              min="0" max="999999999" />
            {errors.wMinMax && (<p className={s.danger}><b>{errors.wMinMax}</b></p>)}
          </div>
          <div className={s.divInputs}>
            <p className={s.words}>Life expectancy (years)</p>
            <input type="number" name="lMin" value={input.lMin}
              placeholder='Min...' onChange={handleInputChange}
              className={errors.lMinMax ? `${s.inputBox} ${s.min} ${s.dangerBox}` : `${s.inputBox} ${s.min}`}
              min="0" max="999999999" />
            <input type="number" name="lMax" value={input.lMax}
              placeholder='Max...' onChange={handleInputChange}
              className={errors.lMinMax ? `${s.inputBox} ${s.max} ${s.dangerBox}` : `${s.inputBox} ${s.max}`}
              min="0" max="999999999" />
            {errors.lMinMax && (<p className={s.danger}><b>{errors.lMinMax}</b></p>)}
          </div>
          <div className={`${s.divInputs} ${s.lastdiv}`}>
            <p className={s.words}>Image (Url)</p>
            <input type="text" name="img" value={input.img}
              placeholder='http://YourBreedImage.png' onChange={handleInputChange}
              className={errors.img ? `${s.inputBox} ${s.dangerBox}` : s.inputBox} />
            {errors.img && (<p className={s.danger}><b>{errors.img}</b></p>)}
          </div>
          <p className={s.requiredField}>* Required field</p>
          {!modify ?
            <div>
              <button type="submit" className={s.buttonCreate} disabled={Object.keys(errors).length || !input.name || !input.hMin || !input.hMax || !input.wMin || !input.wMax}>Create Breed</button>
              <input type="button" value="Clear" onClick={handleClear} className={`${s.buttonCreate} ${s.btnClear}`} />
            </div>
            : <button type="submit" className={s.buttonCreate} disabled={Object.keys(errors).length || !input.name || !input.hMin || !input.hMax || !input.wMin || !input.wMax}>Modify</button>
          }

        </form>
      </div>
      {/* ---------------------------------Temp-------------------------------------- */}
      <div className={!modify ? s.tempBox : `${s.tempBox} ${s.modify}`}>
        <h3>Add temperaments</h3>
        <input type="text" name="name" value={searchTemp}
          placeholder='Add a new temp.' onChange={handleSearchTemp}
          className={`${s.inputBox} ${s.min} ${s.newTemp}`} autoComplete="off"
          onKeyPress={(e) => e.code === "Enter" && handleAddTemp()}
          maxLength="15" />
        <input type="button" value="Add" onClick={handleAddTemp} className={`${s.buttonTemp} ${s.max}`} />

        <div className={s.tempList}>
          {temperaments?.map(t =>
            <input key={t} type="button" value={t} onClick={handleTempChange}
              className={input.temperaments?.includes(t) ? `${s.tempItems} ${s.selectedItem}` : s.tempItems} />
          )}
        </div>
        <p>{input.temperaments?.map(t => <input key={t} type="button" value={t} onClick={handleDropTemp} className={s.temps} />)}</p>
      </div>
    </div>
  )
}