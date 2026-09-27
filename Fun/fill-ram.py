import sys
import time
import psutil

def help():
    print("Usage: \t {} <size in GiB>".format(sys.argv[0]))
    print("\t {} -a (gets current free RAM)")

if len(sys.argv) != 2:
    help()
    sys.exit(1)

if (sys.argv[1] == "-a"):
    mem = psutil.virtual_memory()
    print("Free memory: {} GiB".format(mem.free / (1024 ** 3)))
    sys.exit(0)

try:
    gib = float(sys.argv[1])
    if gib <= 0:
        print("Size must be positive")
        sys.exit(1)

except ValueError:
    print("Size must be a number")
    sys.exit(1)

size = int(gib * 1024**3) # 1024^3 = 1 GiB
data = bytearray(size)

chunkSize = 4096
for i in range(0, size, chunkSize):
    data[i] = 0

print("Allocated {} bytes".format(size))
print("Press Ctrl-C to release the RAM eater.")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    pass
