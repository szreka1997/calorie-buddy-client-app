import Card from "../UI/Card";
import HorizontalTextWithNoInput from "../UI/HorizontalTextWithNoInput";

function SugarCard({ sugar, addedSugar, style, accent = false }) {
  return (
    <Card style={style}>
      {/* TOTAL SUGAR */}
      <HorizontalTextWithNoInput
        label="Total Sugars (g)"
        value={sugar.toFixed(1)}
        accent={accent}
      />

      {/* TOTAL ADDED SUGAR */}
      <HorizontalTextWithNoInput
        label="Total Added Sugars (g)"
        value={addedSugar.toFixed(1)}
        accent={accent}
      />
    </Card>
  );
}

export default SugarCard;
