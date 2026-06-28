import { Badge } from '@/components/ui/badge';
import type { CaseMessageRow } from '@/lib/types/database';

export function CaseMessagesFeed({
  messages,
  emptyLabel = 'No messages yet.',
  showVisibility = false,
}: {
  messages: CaseMessageRow[];
  emptyLabel?: string;
  showVisibility?: boolean;
}) {
  if (!messages.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const author = message.sender_name || message.sender_email || 'Charis Consult';

        return (
          <div key={message.id} className="rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-foreground">{author}</p>
              {showVisibility ? (
                <Badge variant={message.visibility === 'internal' ? 'outline' : 'secondary'}>
                  {message.visibility === 'internal' ? 'Internal note' : 'Client visible'}
                </Badge>
              ) : null}
              <span className="text-xs text-muted-foreground">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {message.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
