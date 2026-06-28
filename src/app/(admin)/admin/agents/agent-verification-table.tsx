'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ProfileRow } from '@/lib/types/database';
import { ProfileAvatar } from '@/components/dashboard/profile-avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function AgentVerificationTable({ agents }: { agents: ProfileRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((agent) => {
      const haystack = [
        agent.full_name,
        agent.email,
        agent.phone_number,
        agent.agent_state,
        agent.agent_lga,
        agent.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [agents, query]);

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, phone, state, or LGA"
        className="max-w-md rounded-xl bg-white"
      />

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden sm:table-cell">State</TableHead>
              <TableHead className="hidden lg:table-cell">LGA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No agents match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="max-w-[220px] font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar
                        photoUrl={agent.photo_url}
                        name={agent.full_name}
                        className="h-9 w-9 shrink-0"
                      />
                      <span className="truncate">{agent.full_name ?? '—'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {agent.phone_number ?? '—'}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {agent.agent_state ?? '—'}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {agent.agent_lga ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.status === 'verified'
                          ? 'default'
                          : agent.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {(agent.status ?? 'pending').replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/agents/${agent.id}`} prefetch className="text-sm text-[#4b2e6f] hover:underline">
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
