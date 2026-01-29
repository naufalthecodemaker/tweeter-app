"use client";

import { useState, useMemo } from "react";
import { UserCard } from "@/components/user-card";
import { SearchInput } from "@/components/search-input";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/lib/use-debounce";
import { Loader2, UsersIcon } from "lucide-react";

interface User {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
}

interface UsersListProps {
  users: User[];
  followingList: string[];
  currentUserId?: string;
}

export function UsersList({ users, followingList, currentUserId }: UsersListProps) {
  // state buat nampung apa yg diketik user di search 
  const [searchQuery, setSearchQuery] = useState("");
  
  // ppake debounce biar fungsi filter gak jalan tiap 1 huruf diketik 
  const debouncedSearch = useDebounce(searchQuery, 300);

  // indikator buat nampilin loading pas lg nunggu debounce selesai
  const isSearching = searchQuery !== debouncedSearch;

  // pake useMemo biar filter cuma jalan pas query search berubah
  const filteredUsers = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return users;
    }

    const query = debouncedSearch.toLowerCase();
    return users.filter((user) => {
      const username = user.username.toLowerCase();
      const displayName = user.displayName?.toLowerCase() || "";
      const bio = user.bio?.toLowerCase() || "";

      // cari username, nama, atau bio yg cocok 
      return (
        username.includes(query) ||
        displayName.includes(query) ||
        bio.includes(query)
      );
    });
  }, [users, debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by username, display name, or bio..."
        />
      </div>

      {/* nampilin jumlah user yang ketemu */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {isSearching ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Searching...
            </span>
          ) : debouncedSearch ? (
            <>
              Found <span className="font-semibold text-foreground">{filteredUsers.length}</span>{" "}
              {filteredUsers.length === 1 ? "user" : "users"}
            </>
          ) : (
            <>
              Showing <span className="font-semibold text-foreground">{users.length}</span>{" "}
              {users.length === 1 ? "user" : "users"}
            </>
          )}
        </p>
        
        {/* clear search*/}
        {debouncedSearch && !isSearching && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline cursor-pointer"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Kondisi pas lagi nyari (Loading) */}
      {isSearching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        /* klo user yg dicari gaada */
        <Card className="animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-full">
                <UsersIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">No users found</p>
                <p className="text-sm text-muted-foreground">
                  {debouncedSearch ? (
                    <>
                      No users match "<span className="font-medium">{debouncedSearch}</span>"
                    </>
                  ) : (
                    "No users available"
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* list user yg berhasil difilter */
        <div className="grid gap-4">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <UserCard
                user={user}
                // cek status follow dari list id yg dikirim dari server
                isFollowing={followingList.includes(user.id)}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}