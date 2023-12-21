// CollectionSelect.tsx
import { useMemo, type FC, type ChangeEvent } from "react";

import { Select } from "@chakra-ui/react";

import useStore from "@/store/store";

interface CollectionSelectProps {
  collections: Collections;
  onChange: (collection: CollectionExtended) => void;
}

const CollectionSelect: FC<CollectionSelectProps> = ({ collections, onChange }) => {
  const { selectedCollections } = useStore();

  const availableCollections = useMemo(
    () =>
      collections.filter(
        (collection) =>
          !selectedCollections.some(
            (selected) => selected.token_address === collection.token_address,
          ),
      ),
    [collections, selectedCollections],
  );

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCollection = collections.find(
      (collection) => collection.token_address === e.target.value,
    );
    if (selectedCollection) {
      onChange(selectedCollection);
    }
  };

  return (
    <Select placeholder="Select NFT Collection" onChange={handleSelectChange}>
      {availableCollections.map((collection) => (
        <option key={collection.token_address} value={collection.token_address}>
          {collection.name} ({collection.total})
        </option>
      ))}
    </Select>
  );
};

export default CollectionSelect;
