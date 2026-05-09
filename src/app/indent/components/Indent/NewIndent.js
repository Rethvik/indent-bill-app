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
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useShowLoader, useShowMessage } from "@/store/store";

function NewIndent({ saveButtonHandler, closeDialogHandler, customerIndent }) {
  const fetchDone = useRef(false);
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [indent, setIndent] = useState(customerIndent || []);
  const inputrefs = useRef(
    Array.from({ length: currentList.length }, () => React.createRef()),
  );

  const filterSearchHandler = (e) => {
    setSearchValue(e.target.value);
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setCurrentList(filteredData);
  };

  const quantityChangeHandler = (e, item) => {
    let updatedIndent = [...indent];
    const regex = /^\d*$/;
    if (e.target.value !== "" && Number(e.target.value) === 0) {
      return;
    }
    if (e.target.value) {
      if (updatedIndent.length > 0) {
        updatedIndent = updatedIndent.filter(
          (product) => product.product_id !== item.product_id,
        );
        updatedIndent = [
          ...updatedIndent,
          { ...item, quantity: Number(e.target.value) },
        ];
      } else {
        updatedIndent = [{ ...item, quantity: Number(e.target.value) }];
      }
    } else {
      updatedIndent = updatedIndent.filter(
        (product) => product.product_id !== item.product_id,
      );
    }
    setIndent(updatedIndent);
  };

  const onKeyDownHandler = (e, index) => {
    if (e.key === "ArrowDown") {
      if (index < currentList.length - 1) {
        e.preventDefault();
        inputrefs.current[index + 1].focus();
      } else {
        e.preventDefault();
        inputrefs.current[0].focus();
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) {
        inputrefs.current[index - 1].focus();
      } else {
        e.preventDefault();
        inputrefs.current[currentList.length - 1].focus();
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
        const customerIndentProductIds = new Set(
          customerIndent.map((item) => item.product_id),
        );
        let products = result.data.filter((product) => product.active);
        products = products.map((item) => {
          return { ...item, quantity: "" };
        });
        products = products.filter(
          (item) => !customerIndentProductIds.has(item.product_id),
        );
        products = [...customerIndent, ...products];
        setData([...products]);
        setCurrentList([...products]);
      } else {
        showMessage("error", result.message);
      }
    };

    fetchProducts();
  }, [showLoader, showMessage, customerIndent]);

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
                {currentList.map((item, index) => {
                  const orderedItem = indent.find(
                    (orderItem) => orderItem.product_id === item.product_id,
                  );
                  return (
                    <div key={item.product_id} className="flex justify-between">
                      <FieldLabel htmlFor={item.product_id}>
                        {item.name}
                      </FieldLabel>
                      <Input
                        ref={(el) => (inputrefs.current[index] = el)}
                        onKeyDown={(e) => onKeyDownHandler(e, index)}
                        value={orderedItem?.quantity || ""}
                        onChange={(e) => quantityChangeHandler(e, item)}
                        name={item}
                        onWheel={(event) => event.currentTarget.blur()}
                        className="w-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        id={item.product_id}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                      />
                    </div>
                  );
                })}
              </Field>
            </FieldGroup>
          </FieldSet>
        </ScrollArea>
      </div>
      <Separator className="mb-2" />
      <div className="flex flex-row-reverse justify-between">
        <Button
          size="sm"
          variant="green"
          onClick={() => saveButtonHandler(indent)}
        >
          SAVE
        </Button>
        <Button
          size="sm"
          className="mr-2"
          onClick={closeDialogHandler}
          variant="purple"
        >
          CANCEL
        </Button>
      </div>
    </>
  );
}

export default NewIndent;
