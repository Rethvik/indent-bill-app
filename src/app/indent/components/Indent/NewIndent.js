/* eslint-disable react-hooks/refs */
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
// import { isFileExists } from '@/utils/checkFile';
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useShowLoader, useShowMessage } from "@/store/store";

function NewIndent({ saveButtonHandler, closeDialogHandler }) {
  const fetchDone = useRef(false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [indent, setIndent] = useState({});
  const inputrefs = useRef(
    Array.from({ length: currentList.length }, () => React.createRef()),
  );
  const filterSearchHandler = (e) => {
    setSearchValue(e.target.value);
    const filteredData = data.filter((item) =>
      item.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setCurrentList(filteredData);
  };
  const quantityChangeHandler = (e) => {
    const updatedIndent = { ...indent };
    if (e.target.value) {
      updatedIndent[e.target.name] = e.target.value;
    } else {
      delete updatedIndent[e.target.name];
    }
    setIndent(updatedIndent);
  };
  // const saveButtonHandler = async () => {
  //   setLoading(true);
  //   // const response = await fetch('http://localhost:3000/api/indent');
  //   // const result = await response.json();
  //   setLoading(false);
  //   closeDialogHandler();
  //   console.log("Save Button");
  // };
  const onKeyDownHandler = (e, index) => {
    if (e.key === "ArrowDown") {
      if (index < currentList.length - 1) {
        e.preventDefault();
        inputrefs.current[index + 1].current.focus();
      } else {
        e.preventDefault();
        inputrefs.current[0].current.focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) {
        inputrefs.current[index - 1].current.focus();
      } else {
        e.preventDefault();
        inputrefs.current[currentList.length - 1].current.focus();
      }
    }
  };
  const showLoader = useShowLoader((state) => state.showLoader);
  const showMessage = useShowMessage((state) => state.showMessage);
  useEffect(() => {
    if (fetchDone.current) {
      return;
    }
    fetchDone.current = true;
    const fetchProducts = async () => {
      showLoader(true);
      const response = await fetch("http://localhost:3000/api/products");
      const result = await response.json();
      showLoader(false);
      if (result.success) {
        const productNames = result.products
          .filter((product) => product.description === "<p>true</p>")
          .map((item) => item.name);
        setData(productNames);
        setCurrentList(productNames);
      } else {
        showMessage("error", result.message);
      }
    };

    fetchProducts();
  }, [showLoader, showMessage]);
  return (
    <>
      <div>
        <InputGroup className="mb-3">
          <InputGroupInput
            value={searchValue}
            onChange={filterSearchHandler}
            placeholder="Search products..."
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {currentList.length} Products
          </InputGroupAddon>
        </InputGroup>
        <ScrollArea className="h-[430px]">
          <FieldSet className="pr-4 pl-2 py-1 pb-5">
            <FieldGroup>
              <Field>
                {currentList.map((item, index) => (
                  <div key={item} className="flex justify-between">
                    <FieldLabel htmlFor={item.id}>{item}</FieldLabel>
                    <Input
                      ref={inputrefs.current[index]}
                      onKeyDown={(e) => onKeyDownHandler(e, index)}
                      value={indent[item] || ""}
                      onChange={quantityChangeHandler}
                      name={item}
                      onWheel={(event) => event.currentTarget.blur()}
                      className="w-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      id={item}
                      type="number"
                    />
                  </div>
                ))}
              </Field>
            </FieldGroup>
          </FieldSet>
        </ScrollArea>
      </div>
      <Separator className="mb-2" />
      <div className="flex flex-row-reverse">
        <Button
          size="sm"
          variant="green"
          onClick={() => saveButtonHandler(indent)}
          disabled={loading ? true : false}
        >
          {loading && <Spinner className="text-black-500" />}
          {loading ? "SAVING..." : "SAVE"}
        </Button>
        <Button
          size="sm"
          className="mr-2"
          onClick={closeDialogHandler}
          variant="outline"
        >
          CANCEL
        </Button>
      </div>
    </>
  );
}

export default NewIndent;
