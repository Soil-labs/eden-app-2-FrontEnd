import { Maybe, Members } from "@graphql/eden/generated";
import { Card, MatchAvatar } from "ui";

export interface ICandidateProfileCardProps {
  member?: Maybe<Members>;
  percentage?: number;
}

function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);

  return Math.round(value * multiplier) / multiplier;
}

export const CandidateProfileCard = ({
  member,
  percentage,
}: ICandidateProfileCardProps) => {
  return (
    <Card className="bg-white p-3">
      <div className={`flex	items-center gap-8`}>
        <MatchAvatar
          src={member?.discordAvatar!}
          size="md"
          percentage={round(Number(percentage), 1)}
        />
        <div>
          <div>
            <span className="text-xl font-medium tracking-wide">
              {member?.discordName}
            </span>
            <span className="ml-1 text-xs font-normal text-neutral-400">
              {`#${member?.discriminator}`}
            </span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide">3D designer</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
