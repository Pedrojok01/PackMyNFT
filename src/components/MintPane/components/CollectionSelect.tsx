// CollectionSelect.tsx
import type { FC } from "react";

import { Select } from "@chakra-ui/react";

interface CollectionSelectProps {
  collections: Collection[];
  onChange: (collection: Collection) => void;
}

const CollectionSelect: FC<CollectionSelectProps> = ({ collections, onChange }) => {
  return (
    <Select
      placeholder="Select NFT Collection"
      onChange={(e) => {
        const selectedCollection = collections.find(
          (collection) => collection.token_address === e.target.value,
        );
        if (selectedCollection) {
          onChange(selectedCollection);
        }
      }}
    >
      {collections.map((collection) => (
        <option key={collection.token_address} value={collection.token_address}>
          {collection.name}
        </option>
      ))}
    </Select>
  );
};

export default CollectionSelect;
