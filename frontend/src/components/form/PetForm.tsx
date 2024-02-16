import { ChangeEvent, FormEventHandler, useState } from "react";
import formStyles from "./Form.module.css";
import Input from "./Input";
import Select from "./Select";

interface IPetFormProps {
  title: string;
  desc?: string;
  petData?: IPetData;
  btnText: string;
  handleSubmit: (pet: IPetData) => void;
}

export interface IPetData {
  _id?: string;
  images?: File[];
  name?: string;
  age?: string;
  weight?: string;
  color?: string;
}

export default function PetForm({
  title,
  desc,
  handleSubmit,
  petData,
  btnText,
}: IPetFormProps) {
  const [pet, setPet] = useState<IPetData>(petData || {});
  const [preview, setPreview] = useState<File[] | null>(null);
  const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"];

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const fileList: FileList | null = e.target.files;
    if (fileList) {
      const filesArray: File[] = Array.from(fileList);
      setPreview(filesArray);
      setPet({ ...pet, images: filesArray });
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }

  function handleColor(e: ChangeEvent<HTMLSelectElement>) {
    setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text });
  }

  function submit(e: any) {
    e.preventDefault();
    handleSubmit(pet);
  }

  return (
    <div className={`row justify-content-center`}>
      <div className={`${formStyles.form_container} col-6`}>
        <div className={`${formStyles.header} row`}>
          <div className="col-12">
            <h1>{title}</h1>
          </div>
          <div className="col-12">
            <p>{desc}</p>
          </div>
        </div>
        <form onSubmit={submit}>
          <div className={formStyles.preview_pet_images}>
            {preview && preview.length > 0
              ? preview?.map((image, index) => (
                  <img
                    src={URL.createObjectURL(image)}
                    alt={pet.name}
                    key={`${pet.name} + ${index}`}
                  />
                ))
              : pet.images &&
                pet.images.map((image, index) => (
                  <img
                    src={`${process.env.REACT_APP_API}/imgs/pets/${image}`}
                    alt={pet.name}
                    key={`${pet.name} + ${index}`}
                  />
                ))}
          </div>
          <Input
            type="file"
            text="Imagens do Pet"
            name="images"
            handleOnChange={onFileChange}
            multiple={true}
          />
          <Input
            type="text"
            text="Nome do Pet"
            name="name"
            placeholder="Digite o nome"
            handleOnChange={handleChange}
            value={pet.name || ""}
          />
          <Input
            type="text"
            text="Idade do Pet"
            name="age"
            placeholder="Digite a Idade"
            handleOnChange={handleChange}
            value={pet.age || ""}
          />
          <Input
            type="text"
            text="Peso do Pet"
            name="weight"
            placeholder="Digite o peso"
            handleOnChange={handleChange}
            value={pet.weight || ""}
          />
          <Select
            name="color"
            text="Selecione a cor"
            options={colors}
            handleOnChange={handleColor}
            value={pet.color || ""}
          />
          <input
            style={{width: "100%", marginTop: "32px"}}
            className="btn btn-primary btn-lg d-flex"
            type="submit"
            value={btnText}
          />
        </form>
      </div>
    </div>
  );
}
