import { Box, Skeleton } from "@mui/material";

const StockChartSkeleton = ({ height = 300, showFilter = true }) => {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        minHeight: height + 100,
        background: "rgba(28, 28, 30, 0.7)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: `
          0 8px 32px 0 rgba(0, 0, 0, 0.37),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.05)
        `,
        animation: "shimmer 2s ease-in-out infinite",
        "@keyframes shimmer": {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "200%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)",
          animation: "slide 2s ease-in-out infinite",
        },
        "@keyframes slide": {
          "0%": {
            left: "-100%",
          },
          "100%": {
            left: "100%",
          },
        },
      }}
    >
      {/* Glass reflection effect */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ p: 3, pb: 2, position: "relative", zIndex: 1 }}>
        {/* Symbol */}
        <Skeleton
          variant="text"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.08)",
            width: "100px",
            height: "28px",
            mb: 1,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        />

        {/* Price */}
        <Skeleton
          variant="text"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.08)",
            width: "130px",
            height: "32px",
            mb: 0.5,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        />

        {/* Change */}
        <Skeleton
          variant="text"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.08)",
            width: "150px",
            height: "24px",
            mb: 2,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        />

        {/* Filter buttons */}
        {showFilter && (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              bgcolor: "rgba(0, 0, 0, 0.3)",
              borderRadius: 2.5,
              p: 0.5,
              width: "fit-content",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                  width: "45px",
                  height: "32px",
                  borderRadius: 2,
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Chart area - Glass panel */}
      <Box sx={{ px: 2, pb: 2, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: "100%",
            height: height,
            background: "rgba(0, 0, 0, 0.3)",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
              pointerEvents: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default StockChartSkeleton;
