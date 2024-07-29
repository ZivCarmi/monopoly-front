import {
  PardonCard,
  PurchasableTile,
  TileTypes,
} from "@ziv-carmi/monopoly-utils";
import { useMemo } from "react";
import MyPardonCard from "./MyPardonCard";
import MyProperty from "./MyProperty";

const order = [TileTypes.PROPERTY, TileTypes.AIRPORT, TileTypes.COMPANY];

const MyPropertiesList = ({
  properties,
  pardons,
}: {
  properties: PurchasableTile[];
  pardons: PardonCard[];
}) => {
  const sortedMyProperties = useMemo(
    () =>
      properties.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type)),
    [properties]
  );

  return (
    <ul className="divide-y">
      {sortedMyProperties.map((tile) => (
        <MyProperty key={tile.name} tile={tile} />
      ))}
      {pardons.map((pardonCard) => (
        <MyPardonCard key={pardonCard.deck} pardonCard={pardonCard} />
      ))}
    </ul>
  );
};

export default MyPropertiesList;
